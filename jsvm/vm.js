Array.prototype.append = function(array2) {
    for (i = 0; i < array2.length; i++) {
        this[this.length] = array2[i];
    }
};

Array.prototype.peek = function(n) {
    return this[this.length-1-n];
};

Array.prototype.triTopologique = function() {
    tri = [];
    dejavu = this.map(function(deps, n) {return false;});
    profondeur = function(deps, n) {
        dejavu[n] = true;
        deps.each(function(v) {
            if (!dejavu[v]) {
                profondeur(this[v], v);
            }
        }.bind(this));
        tri.push(n);
    }.bind(this);
    this.each(function(deps, n){
        if (!dejavu[n]) {
            profondeur(deps, n);
        }
    });
    return tri;
};

/* */

function log(str) {
    $('log').insert("<div>" + str + "</div>");
}

/* **************************************** */

function vm() {
    /* The stack (grows up) :
     *
     *     top
     *
     * return value
     * return value
     *.junk
     *.junk
     *.junk
     * return address
     * param
     * param
     *
     *   bottom
     */
    
    this.clean = function() {
        this.stack = $A(); // Stack
        this.ip = 0;       // Instruction pointer.
        this.exit = false; // Halt
    };
    this.eval = function(instructions) {
        this.stack.push(-1);
        for (this.ip = 0; (!this.exit) && (this.ip >= 0); this.ip++) {
            var instr = instructions[this.ip];
            var op    = this.operations[instr.operation];
            var args  = instr.arguments;
            op.eval.apply(this, args);
        }
        return this.stack;
    };

    // Initialize to a clean state.
    this.clean();

    vm = this;
    // I can't manage to create a constructor from witin vm's constuctor. So I use an anonymous object in place.
    this.op = function() {
        this.operation = arguments[0];
        this.arguments = [];
        
        for (i = 1; i < arguments.length; i++) {
            this.arguments.push(arguments[i]);
        }
        
        this.display = function() {
            return vm.operations[this.operation].display.apply(this, this.arguments);
        }
    };
    
    this.operations = {
        comment: {
            display : function(text) { return "# " + text; },
            eval    : function(text) { }
        },
        pop: {
            display : function() { return "pop"; },
            eval    : function() { this.stack.pop(); }
        },
        push: {
            display : function(val) { return "push " + val; },
            eval    : function(val) { this.stack.push(val); }
        },
        // Aller chercher un élément plus bas dans la pile
        peek: {
            display : function(shift) { return "peek " + shift; },
            eval    : function(shift) { this.stack.push(this.stack.peek(shift)); }
        },
        // Remplacer un élément plus bas dans la pile (contraire de peek)
        // "peek 10; poke 10" est équivalent à ne rien faire du tout.
        poke: {
            display : function(shift) { return "poke " + shift; },
            eval    : function(shift) {
                e = this.stack.pop();
                this.stack[this.stack.length - 1 - shift] = e;
            }
        },
        // somme des 2 éléments en haut de la pile
        add: {
            display : function() { return "add"; },
            eval    : function() {
                a = this.stack.pop();
                b = this.stack.pop();
                this.stack.push(a + b);
            }
        },
        // Saut inconditionnel vers une instruction
        jump: {
            display : function(instr) { return "jump " + instr; },
            eval    : function(instr) { this.ip = instr - 1; }
        },
        // Appeller la fonction instr, avec nbparam paramètres.
        call: {
            display : function(instr, nbparam) { return "call " + instr; },
            eval    : function(instr, nbparam) {
                this.stack.push(this.ip);
                this.ip = instr - 1;
            }
        },
        ret: {
            display : function() { return "return"; },
            eval    : function() { this.ip = this.stack.pop() - 1; }
        },
        exit: {
            display : function() { return "exit"; },
            eval    : function() { this.exit = true; }
        }
    };
};

function world(name) {
    this.blocs = [];
    this.newBloc = function(name, nbEntrees, nbSorties) {
        uid = this.blocs.length;
        this.blocs[uid] = new bloc(uid, name, nbEntrees, nbSorties);
        return this.blocs[uid];
    }
    this.compile = function(vm) {
        var comp = [];
        var pos = [];
        var curpos  = 0;
        var complist = this.blocs.invoke("compile", vm);
        complist.each(function (bc) {
            pos[bc.uid] = curpos;
            curpos += bc.length;
        });
        
        complist.each(function (bc) {
            bc.each(function (instr) {
//                if (instr instanceof op.jump) { // TODO : this is ugly.
//                    comp.push(new vm.op.comment("-----"));
//                } else {
                    comp.push(instr);
//                }
            });
        });

        return comp;
    }
}

function bloc(uid, name, nbEntrees, nbSorties) {
    this.uid = uid;
    this.name = name;
    this.nbEntrees = nbEntrees + 1; // +1 pour l'adresse de retour (call)
    this.nbSorties = nbSorties + 1; // +1 pour l'adresse de retour (call)
    this.blocs = new Array();
    this.blocdeps = new Array();
    this.portdeps = new Array();
    this.addBloc = function(bloc) {
        this.blocs.push(bloc);
        this.blocdeps.push($A());
        this.portdeps.push($A()); // TODO : détecter quand il n'y a pas le bon nombre de connexions...
        return this.blocs.length - 1;
    };
    this.connect = function(blocSortie, portSortie, blocEntree, portEntree) {
        this.portdeps[blocEntree][portEntree] = {
            blocSortie: blocSortie,
            portSortie: portSortie,
        };
        this.blocdeps[blocEntree].push(blocSortie);
    };
    this.compile = function(vm) {
        var tri = this.blocdeps.triTopologique();
        
        if (tri[0] != 0) { error(); }
        
        var stackpos = [];
        var curpos = 0;
        var comp = [];
        comp.push(new vm.op("comment", "Bloc " + this.uid + " " + this.name));
        tri.each(function(n) {
            stackpos[n] = curpos;
            
            var b = this.blocs[n];
            
            // On empile chaque paramètre du bloc à appeller
            for (entree = 0; entree < b.nbEntrees - 1; entree++) { // -1 car l'adresse de retour est pushée par "call"
                var dep = this.portdeps[n][entree];
                var pos = stackpos[dep.blocSortie] + dep.portSortie;
                comp.push(new vm.op("peek", curpos - pos - 1));
                curpos++;
            }

            if (n > 1) { // 0 & 1 are inputs & outputs
                comp.push(new vm.op("call", b.uid));
            }
            
            curpos -= b.nbEntrees; // le bloc appelé a empilé tous ses paramètres
            curpos += b.nbSorties; // et a dépilé ses résultats
        }, this);
        
        console.log(curpos, this.nbEntrees);
        comp.push(new vm.op("peek", curpos - this.nbEntrees));
        curpos++;
        for (s = 0; s < this.nbSorties; s++) {
            comp.push(new vm.op("poke", curpos - this.nbSorties));
        }
        for (j = 0; j < curpos - this.nbSorties + 1; j++) {
            comp.push(new vm.op("pop"));
        }
        
        comp.push(new vm.op("ret"));
        
        return comp;
    };

    // This is a hack...
    this.addBloc({ // 0 : self inputs
        name: "Entrées",
        nbEntrees: 0,
        nbSorties: this.nbEntrees,
        compile: function(){ return []; }
    });
    this.addBloc({ // 1 : self outputs
        name: "Sorties",
        nbEntrees: this.nbSorties,
        nbSorties: 0,
        compile: function(){ return []; }
    });
}

function init() {
    w = new world("Brave");
    wPlus   = w.newBloc("+", 2, 1);
    wOne    = w.newBloc("1", 0, 1);
    wTwo    = w.newBloc("2", 0, 1);
    wThesum = w.newBloc("Une somme", 0, 1);
    
    wOne.compile  = function(vm) { return [ new vm.op("push", 1) ]; };
    wTwo.compile  = function(vm) { return [ new vm.op("push", 2) ]; };
    wPlus.compile = function(vm) { return [ new vm.op("add") ]; };
    
    wiPlus1 = wThesum.addBloc(wPlus);
    wiPlus2 = wThesum.addBloc(wPlus);
    wiOne   = wThesum.addBloc(wOne);
    wiTwo   = wThesum.addBloc(wTwo);
    
    wThesum.connect(wiOne,   0, wiPlus1, 0);
    wThesum.connect(wiTwo,   0, wiPlus1, 1);
    wThesum.connect(wiPlus2, 0, 1,       0);
    wThesum.connect(wiPlus1, 0, wiPlus2, 0);
    wThesum.connect(wiTwo,   0, wiPlus2, 1);
    
    // compThesum = wThesum.compile();
    var testVM = new vm();
    compThesum = w.compile(vm);

    debug = compThesum;
    
    log("<code><pre>" + compThesum.map(function (e, i) { return i + "&gt " + e.display(); }).join("\n") + "</pre></code>");
    
/*    var testVm = new vm();
    log(testVm.eval(compThesum).join(", "));

    testdisplay();*/
}
