Array.prototype.remove = function(i) {
    if (typeof i != "number")
        i = this.indexOf(i);
    this.splice(i,1);
    return i;
}

Array.prototype.insert = function(v, i) {
    if (i === undefined)
        i = this.length;
    this.splice(i,0,v);
    return i;
}

function faireCallbacks(liste) {
    var a = $.makeArray(arguments);
    a.shift();
    for (var i = 0; i < liste.length; i++) {
        liste[i].apply(a[0], a);
    }
}

function makeCollection(obj, nom) {
    var Nom = nom.charAt(0).toUpperCase() + nom.substring(1);
    obj[nom] = [];
    obj['add' + Nom] = function(stuff, position) {
        obj[nom].insert(stuff, position);
        faireCallbacks(obj['cbAdd' + Nom], obj, stuff, position);
    };
    obj['cbAdd' + Nom] = [];
    obj['onAdd' + Nom] = function(callback) {
        obj['cbAdd' + Nom].push(callback);
    };
    obj['remove' + Nom] = function(position) {
        obj[nom].remove(position);
        faireCallbacks(obj['cbRemove' + Nom], obj, position);
    };
    obj['cbRemove' + Nom] = [];
    obj['onRemove' + Nom] = function(callback) {
        obj['cbRemove' + Nom].push(callback);
    };
    obj['move' + Nom] = function(from, to) {
        var stuff = obj[nom][from];
        obj[nom].remove(from);
        obj[nom].insert(stuff, to);
        faireCallbacks(obj['cbMove' + Nom], obj, from, to);
   };
    obj['cbMove' + Nom] = [];
    obj['onMove' + Nom] = function(callback) {
        obj['cbMove' + Nom].push(callback);
    };
}

//    makeField(this, , new ());
function makeField(obj, nom, defaultValue) {
    var Nom = nom.charAt(0).toUpperCase() + nom.substring(1);
    obj['_' + nom] = defaultValue;
    obj[nom] = function(val) {
        if (val === undefined) {
            return obj['_' + nom];
        } else {
            obj['_' + nom] = val;
            faireCallbacks(obj['cbChange' + Nom], obj, val);
        }
    };
    obj['cbChange' + Nom] = [];
    obj['onChange' + Nom] = function(callback) {
        obj['cbChange' + Nom].push(callback);
    };
}