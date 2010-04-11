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

function bloc(name, nbEntrees, nbSorties) {
    this.name = name;
    this.nbEntrees = nbEntrees;
    this.nbSorties = nbSorties;
    this.blocs = new Array();
    this.blocdeps = new Array();
    this.portdeps = new Array();
    this.addBloc = function(bloc) {
        this.blocs.push(bloc);
        this.blocdeps.push($A());
        this.portdeps.push($A());
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
        tri = this.blocdeps.triTopologique();
        
        if (tri[0] != 0) { error(); }
        
        stackpos = [];
        curpos = 0;
        comp = [];
        debug = [];
        tri.each(function(n) {
            stackpos[n] = curpos;

            b = this.blocs[n];
            debug.push(b);

            // On empile les paramètres de chaque bloc à appeller
            for (entree = 0; entree < b.nbEntrees; entree++) {
                dep = this.portdeps[n][entree];
                pos = stackpos[dep.blocSortie] + dep.portSortie;
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
    var plus = new bloc("+", 2, 1);
    var one  = new bloc("1", 0, 1);
    var two  = new bloc("2", 0, 1);

    one.compile  = function() { return [ new op.push(1) ]; };
    two.compile  = function() { return [ new op.push(2) ]; };
    plus.compile = function() { return [ new op.add() ]; };

    var bloc3 = new bloc("bloc3", 0, 1);
    bplus1 = bloc3.addBloc(plus);
    bplus2 = bloc3.addBloc(plus);
    bone   = bloc3.addBloc(one);
    btwo   = bloc3.addBloc(two);
    bloc3.connect(bone, 0, bplus1, 0);
    bloc3.connect(btwo, 0, bplus1, 1);
    bloc3.connect(bplus2, 0, 1, 0);
    bloc3.connect(bplus1, 0, bplus2, 0);
    bloc3.connect(btwo, 0, bplus2, 1);
    
    comp3 = bloc3.compile();
    log("<code><pre>" + comp3.map(function (e, i) { return i + "&gt " + e.display; }).join("\n") + "</pre></code>");
    
    /* var comp3 = new Array();
    
    comp3.append(one.compile());
    comp3.append(two.compile());
    comp3.append(plus.compile()); */
    
    // debug = comp3;

    var test = new vm();
    log(test.eval(comp3).join(", "));
}
