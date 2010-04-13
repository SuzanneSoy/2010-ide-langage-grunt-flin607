function init() {
    window.setTimeout("log('Start'); window.setTimeout('test_vm_call_and_compile()', 0);", 100);
}

/* **************************************** */

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

function trace(str) {
    if (typeof console != "undefined") {
        console.log(str);
    }
}

function error(str) {
    $('log').insert("<div class=\"error\">" + str + "</div>");
    _error();
}

/* **************************************** */
function vm() {
    /* The stack (grows up) :
     *
     *     top
     *
     * return value
     * return value
     * junk
     * junk
     * junk
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
        for (this.ip = 0; (!this.exit); this.ip++) {
            var instr = instructions[this.ip];
            var op    = this.operations[instr.operation];
            var args  = instr.arguments;
            trace(this.ip + " : [" + this.stack.join(",") + "]            (" + instr.display() + ")");
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
            eval    : function(text) {}
        },
        lineskip: {
            display : function() { return ""; },
            eval    : function() {}
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
        // N'exécute pas l'instruction suivante ssi le sommet de la pile vaut 0 (Skip if Zero)
        sz: {
            display : function() { return "sz"; },
            eval    : function() { if (this.stack.peek(0) == 0) { this.ip++; } }
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
            eval    : function() { this.ip = this.stack.pop(); }
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
    this.compile = function(vm, entryPoint) {
        var comp = [];
        var pos = [];
        var curpos  = 0;
        var comp = [];
        
        comp.push(new vm.op("comment", "Point d'entrée du programme :"));
        comp.push(new vm.op("lineskip"));
        comp.push(new vm.op("call", entryPoint.uid));
        comp.push(new vm.op("exit"));
        curpos += 4;
        
        this.blocs.each(function (b) {
            bc = b.compile(vm);
            
            comp.push(new vm.op("lineskip"));
            curpos++;
            
            pos[b.uid] = curpos;
            comp.append(bc);
            curpos += bc.length;
        });

        for (instr = 0; instr < comp.length; instr++) {
            if (comp[instr].operation == "call") {
                comp[instr] = new vm.op("call", pos[comp[instr].arguments[0]]);
            }
        }
        
        comp.display = function () {
            return this.map(function (e, i) { return i + "&gt " + e.display(); }).join("\n") + "</pre></code>"
        }
        
        return comp;
    }
}

function bloc(uid, name, nbEntrees, nbSorties) {
    this.uid = uid;
    this.name = name;
    this.nbEntrees = nbEntrees;
    this.nbSorties = nbSorties;
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
    this.innerCompile = function(vm) {
        var tri = this.blocdeps.triTopologique();
        
        // Est-ce vraiment nécessaire ?
        // if (tri[0] != 0) { error("Les entrées ne sont pas en premier dans le bloc " + this.name); }

        /* Stack :
         * a return adress
         * 9 resutl 1 of this bloc
         * 8 result 0 of this bloc    stackpos[1] = 8
         * 7 result 0 of bloc 3       stackpos[3] = 7
         * 6 result 2 of bloc 2
         * 5 result 1 of bloc 2
         * 4 result 0 of bloc 2       stackpos[2] = 4
         * 3 return adress
         * 2 param 2
         * 1 param 1                  
         * 0 param 0                  stackpos[0] = 0
         *
         * Before ret, poke elements 7,9,a down to
         *   positions 0,1,2, and pop the rest.
         */
        
        var stackpos = [];            // Position dans la pile des résultats de chaque bloc.
        stackpos[0] = this.nbEntrees; // paramètres + adresse de retour.
        var curpos = this.nbEntrees;  // Position actuelle du sommet de pile. Les paramètres ont déjà été mis sur la pile.
        var comp = [];                // «Bytecode» généré.
        
        // 1 (les sorties) devrait être à la fin, potentiellement suivi par du code mort :
        // des blocs non connectés à la sortie. On s'assure qu'il est bien à la fin.
        // De plus, on enlève 0 (les entrées) car ils sont déjà sur la pile
        tri = tri.without(0, 1);
        tri.push(1);

        tri.each(function (n) {
            stackpos[n] = curpos;
            var b = this.blocs[n];

            // On empile chaque paramètre du bloc à appeler.
            for (var entree = 0; entree < b.nbEntrees; entree++) {
                var dep = this.portdeps[n][entree];
                if (typeof dep == "undefined") {
                    error("Entrée " + entree + " manquante pour le bloc " + n + " (" + b.name + ") de " + this.name);
                }
                var pos = stackpos[dep.blocSortie] + dep.portSortie;
                comp.push(new vm.op("peek", curpos - pos - 1));
                curpos++;
            }

            if (n != 1) {                            // Le bloc "sortie" est un fake
                comp.push(new vm.op("call", b.uid)); // pusher l'adresse de retour et appeler le bloc
            }

            curpos -= b.nbEntrees; // le bloc appelé a empilé tous ses paramètres
            curpos += b.nbSorties; // et a dépilé ses résultats
        }, this);
        
        return { code: comp, junk: curpos - this.nbSorties + 1 };
    };
    this.compile = function(vm) {
        var comp = [];
        
        comp.push(new vm.op("comment", "Bloc " + this.uid + " (" + this.name + ")"));
        comp.push(new vm.op("lineskip"));
        
        // On réserve la place pour écrire les valeurs de retour.
        for (var i = 0; i < this.nbSorties - this.nbEntrees; i++) {
            comp.push(new vm.op("push", "0"));
        }
        
        startpos = Math.max(this.nbEntrees, this.nbSorties);
        
        // On récupère les entrées en les faisant «sauter par-dessus» l'adresse
        // de retour et les places réservées pour la sortie (s'il y en a).
        for (var i = 0; i < this.nbEntrees; i++) {
            comp.push(new vm.op("peek", startpos));
        }
        
        // Le code du bloc à proprement parler.
        var inner = this.innerCompile(vm)
        comp.append(inner.code);
        
        // On fait remonter l'adresse de retour au-dessus des valeurs de retour.
        comp.push(new vm.op("peek", startpos + inner.junk + this.nbSorties - this.nbEntrees));
        
        // On fait descendre les valeurs de retour et l'adresse de retour.
        for (var i = 0; i < this.nbSorties + 1; i++) {
            comp.push(new vm.op("poke", startpos + inner.junk));
        }
        
        // On pop les calculs intermédiaires et (si nécessaire) les valeurs
        // d'entrées qui n'ont pas été écrasées par une valeur de sortie.
        for (var i = 0; i < (startpos + inner.junk) - this.nbSorties; i++) {
            comp.push(new vm.op("pop"));
        }
        
        // Et ne pas oublier de faire return...
        comp.push(new vm.op("ret"));
        
        return comp;
    }
    
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

function test_vm_call_and_compile() {
    w = new world("Brave");
    wPlus   = w.newBloc("+", 2, 1);
    wOne    = w.newBloc("1", 0, 1);
    wTwo    = w.newBloc("2", 0, 1);
    wThesum = w.newBloc("Une somme", 2, 1);
    wTest   = w.newBloc("Test", 0, 1);
    
    wOne.innerCompile  = function(vm) { return { junk: 0, code: [ new vm.op("push", 1) ] }; };
    wTwo.innerCompile  = function(vm) { return { junk: 0, code: [ new vm.op("push", 2) ] }; };
    wPlus.innerCompile = function(vm) { return { junk: 0, code: [ new vm.op("add")     ] }; };
    
    wiPlus1 = wThesum.addBloc(wPlus);
    wiPlus2 = wThesum.addBloc(wPlus);
    wiPlus3 = wThesum.addBloc(wPlus);
    wiPlus4 = wThesum.addBloc(wPlus);
    wiOne   = wThesum.addBloc(wOne);
    wiTwo   = wThesum.addBloc(wTwo);
    
    wThesum.connect(wiOne,   0, wiPlus1, 0);
    wThesum.connect(wiTwo,   0, wiPlus1, 1);
    wThesum.connect(wiPlus4, 0, 1,       0);
    wThesum.connect(wiPlus1, 0, wiPlus2, 0);
    wThesum.connect(wiTwo,   0, wiPlus2, 1);
    wThesum.connect(0,       0, wiPlus3, 0);
    wThesum.connect(0,       1, wiPlus3, 1);
    wThesum.connect(wiPlus2, 0, wiPlus4, 0);
    wThesum.connect(wiPlus3, 0, wiPlus4, 1);
    
    wiThesum = wTest.addBloc(wThesum);
    wiTest1  = wTest.addBloc(wOne);
    wiTest2  = wTest.addBloc(wTwo);
    wTest.connect(wiTest1,  0, wiThesum, 0);
    wTest.connect(wiTest2,  0, wiThesum, 1);
    wTest.connect(wiThesum, 0, 1,        0);
    
    var testVM = new vm();
    compThesum = w.compile(vm, wTest);

    log("<code><pre>" + compThesum.display());
    log(testVM.eval(compThesum).join(", "));
    
/*    var testVm = new vm();
    log(testVm.eval(compThesum).join(", "));

    testdisplay();*/
}
