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

op = {
    push: function(val) {
        this.display = "push " + val;
        this.eval = function(vm) {
            vm.stack.push(val);
        };
    },
    peek: function(val) {
        this.display = "peek " + val;
        this.eval = function(vm) {
            vm.stack.push(vm.stack.peek(val));
        };
    },
    add: function() {
        this.display = "add";
        this.eval = function(vm) {
            a = vm.stack.pop();
            b = vm.stack.pop();
            vm.stack.push(a + b);
        }
    },
    jump: function(instr) {
        this.display = "jump " + instr;
        this.eval = function(vm) {
            vm.ip = instr - 1;
        }
    },
    pushIp: function() {
        this.display = "push Ip";
        this.eval = function(vm) {
            vm.stack.push(vm.ip);
        }
    },
    ret: function(nbval, nbdrop) {
        this.display = "return " + nbval + " drop " + nbdrop;
        this.eval = function(vm) {
            // This is a dirty way of doing it...
            temp = [];
            while (nbval-- > 0) { temp.push(vm.stack.pop()); }
            while (nbdrop-- > 0) { vm.stack.pop(); }
            retIp = vm.stack.pop();
            for(i = 0; i < temp.length; i++) { vm.stack.push(temp[i]); }
            vm.ip = retIp - 1;
        }
    },
    exit: function() {
        this.display = "exit";
        this.eval = function(vm) {
            vm.exit = true;
        }
    }
};

function vm() {
    this.clean = function() {
        this.stack = $A(); // Stack
        this.ip = 0;       // Instruction pointer.
        this.exit = false; // Halt
    };
    this.eval = function(instructions) {
        this.stack.push(-1);
        for (this.ip = 0; (!this.exit) && (this.ip >= 0); this.ip++) {
            instructions[this.ip].eval(this);
        }
        return this.stack;
    };
    this.clean();
};

function world(name) {
    this.blocs = [];
    this.newBloc = function(name, nbEntrees, nbSorties) {
        uid = this.blocs.length;
        this.blocs[uid] = new bloc(uid, name, nbEntrees, nbSorties);
        return this.blocs[uid];
    }
}

function bloc(uid, name, nbEntrees, nbSorties) {
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
    this.compile = function() {
        var tri = this.blocdeps.triTopologique();
        
        if (tri[0] != 0) { error(); }
        
        var stackpos = [];
        var curpos = 0;
        var comp = [];
        tri.each(function(n) {
            stackpos[n] = curpos;

            var b = this.blocs[n];

            // On empile les paramètres de chaque bloc à appeller
            for (entree = 0; entree < b.nbEntrees; entree++) {
                var dep = this.portdeps[n][entree];
                var pos = stackpos[dep.blocSortie] + dep.portSortie;
                comp.push(new op.peek(curpos - pos - 1));
                curpos++;
            }
            
            comp.append(b.compile());
            
            curpos -= b.nbEntrees; // le bloc appelé a empilé tous ses paramètres
            curpos += b.nbSorties; // et a dépilé ses résultats
        }, this);
        
        comp.push(new op.ret(this.nbSorties, curpos));
        comp.push(new op.exit());
        
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
/*    plus = new bloc(0, "+", 2, 1);
    one  = new bloc(1, "1", 0, 1);
    two  = new bloc(2, "2", 0, 1);

    one.compile  = function() { return [ new op.push(1) ]; };
    two.compile  = function() { return [ new op.push(2) ]; };
    plus.compile = function() { return [ new op.add() ]; };

    var bloc3 = new bloc(3, "bloc3", 0, 1);
    bplus1 = bloc3.addBloc(plus);
    bplus2 = bloc3.addBloc(plus);
    bone   = bloc3.addBloc(one);
    btwo   = bloc3.addBloc(two);
    bloc3.connect(bone, 0, bplus1, 0);
    bloc3.connect(btwo, 0, bplus1, 1);
    bloc3.connect(bplus2, 0, 1, 0);
    bloc3.connect(bplus1, 0, bplus2, 0);
    bloc3.connect(btwo, 0, bplus2, 1);
    
    comp3 = bloc3.compile(); */
    
    w = new world("Brave");
    wPlus   = w.newBloc("+", 2, 1);
    wOne    = w.newBloc("1", 0, 1);
    wTwo    = w.newBloc("2", 0, 1);
    wThesum = w.newBloc("Une somme", 0, 1);
    
    wOne.compile  = function() { return [ new op.push(1) ]; };
    wTwo.compile  = function() { return [ new op.push(2) ]; };
    wPlus.compile = function() { return [ new op.add() ]; };
    
    wiPlus1 = wThesum.addBloc(wPlus);
    wiPlus2 = wThesum.addBloc(wPlus);
    wiOne   = wThesum.addBloc(wOne);
    wiTwo   = wThesum.addBloc(wTwo);
    
    wThesum.connect(wiOne,   0, wiPlus1, 0);
    wThesum.connect(wiTwo,   0, wiPlus1, 1);
    wThesum.connect(wiPlus2, 0, 1,       0);
    wThesum.connect(wiPlus1, 0, wiPlus2, 0);
    wThesum.connect(wiTwo,   0, wiPlus2, 1);
    
    compThesum = wThesum.compile();
    
    log("<code><pre>" + compThesum.map(function (e, i) { return i + "&gt " + e.display; }).join("\n") + "</pre></code>");
    
    var testVm = new vm();
    log(testVm.eval(compThesum).join(", "));
}
