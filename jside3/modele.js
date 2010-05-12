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

function Monde(nom) {
    $.extend(this, {
        uid: singleton.uid(),
        // Propriétés
        nom: nom,
        // Parents
        // Enfants
        log: null,
        barreOutils: null, // J'ai des doutes sur la présence de barreOutils…
        blocs: [],
        scratch: null,
        // Ajout
        ajouterBloc: function(b) {
            b.monde = this;
            this.blocs.push(b);
        },
        définirBarreOutils: function(bo) {
            bo.monde = this;
            this.barreOutils = bo;
        },
        définirLog: function(l) {
            l.monde = this;
            this.log = l;
        },
        // Suppression
        supprimerBloc: function(b) {
            this.blocs.remove(b);
        }
    });
    /*this.scratch = new Bloc("Scratch");
    this.ajouterBloc(this.scratch);
    var iscratch = new InstanceBloc(this.scratch, {vues: this.vues}); // Attention, devrait utiliser une définition !!!
    this.scratch.ajouterInstance(iscratch);*/
    this.scratch = new Définition(); // this.scratch.bloc == null;
}

function BarreOutils() {
    $.extend(this, {
        monde: null,
    });
}

function Log() {
    $.extend(this, {
        monde: null,
        messages: [],
        cbMessage: [],
        // Ajout
        envoiMessage: function(msg) {
            this.messages.push(msg);
            faireCallbacks(this.cbMessage, msg);
        },
        // Évènements
        onMessage: function(callback) {
            this.cbMessage.push(callback);
        }
    });
}

function Bloc(nom) {
    $.extend(this, {
        uid: singleton.uid(),
        // Propriétés
        nom: nom,
        description: '', // Est une définition ?
        // Parents
        monde: null,
        // Utilisation
        instances: [],
        // Enfants
        définitions: [],
        portsEntree: [],
        portsSortie: [],
        // Ajout
        /*ajouterInstance: function(ib) {
            //ib.bloc = this;
            this.instances.push(ib);
        },*/
        demanderInstance: function() {
            var ib = new InstanceBloc();
            ib.bloc = this;
            this.instances.push(ib);
            return ib;
        },
        // Modification
        /*déplacerDéfinition: function(def, position) {
            var pos = définitions.remove(def);
            if (pos < position) position--;
            définitions.insert(def,position);
        },
        déplacerPortEntree: function(port, position) {
            var pos = portsEntree.remove(port);
            if (pos < position) position--;
            portsEntree.insert(port,position);
        },
        déplacerPortSortie: function(port, position) {
            var pos = portsSortie.remove(port);
            if (pos < position) position--;
            portsSortie.insert(port,position);
        },*/
        ajouterDéfinition: function(d) {
            d.bloc = this;
            this.définitions.push(d);
            faireCallbacks(this.cbAjoutDéfinition, d);
        },
        cbAjoutDéfinition: [],
        onAjoutDéfinition: function(callback) {
            this.cbAjoutDéfinition.push(callback);
        }
    });
}

function InstanceBloc() {
    $.extend(this, {
        uid: singleton.uid(),
        // Propriétés
        bloc: null,
        // Parents
        définition: null,
        // Enfants
        //instancesPorts: [],
        // Ajout
    });
}

function Définition(nom) {
    $.extend(this, {
        uid: singleton.uid(),
        // Propriétés
        nom: nom,
        type: null,
        //description: '',
        // Parents
        bloc: null,
        // Enfants
        connexions: [],
        instancesBlocs: [],
        // Ajout
        ajouterInstanceBloc: function(ib) {
            ib.définition = this;
            this.instancesBlocs.push(ib);
            faireCallbacks(this.cbAjoutInstanceBloc, ib);
        },
        ajouterConnexion: function(c) {
            c.définition = this;
            this.connexion.push(c);
        },
        cbAjoutInstanceBloc: [],
        onAjoutInstanceBloc: function(callback) {
            this.cbAjoutInstanceBloc.push(callback);
        }
    });
}

function Connexions(de, vers, définitionParente) {
    $.extend(this, {
        uid: singleton.uid(),
        // Propriétés
        de: de,
        vers: vers,
        // Parents
        définition: définitionParente,
        // Enfants
        // Modification
        modifierDe: function(nouveauDe) {
            this.de = nouveauDe;
        },
        modifierVers: function(nouveauVers) {
            this.vers = nouveauVers;
        }
    });
}

function Port(sens, blocParent) {
    $.extend(this, {
        uid: singleton.uid(),
        // Propriétés
        sens: sens, /* entrée / sortie */
        nom: '',
        description: '',
        // ?
        instances: [],
        // Parents
        bloc: blocParent,
        // Enfants
        connexions: []
    });
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