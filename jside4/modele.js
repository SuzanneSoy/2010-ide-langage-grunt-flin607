Array.prototype.remove = function(i) {
    if (typeof i != "number")
        i = this.indexOf(i);
    this.splice(i,1);
    return i;
}

Array.prototype.insert = function(v, i) {
    if (arguments.length == 1)
        i = this.length;
    this.splice(i,0,v);
    return i;
}

singleton = (function() {
    var s = { uid: 0 };
    return {
        uid: function () {
            return s.uid++;
        }
    };
})();

function faireCallbacks(liste) {
    var a = $.makeArray(arguments);
    a.shift();
    for (var i = 0; i < liste.length; i++) {
        liste[i].apply(a[0], a);
    }
}

/*function InstancePort(port, instanceBlocParente) {
    $.extend(this, {
        uid: singleton.uid(),
        // Propriétés
        port: port,
        // Parents
        instanceBloc: instanceBlocParente,
        // Enfants
        liens: []
    });
}*/