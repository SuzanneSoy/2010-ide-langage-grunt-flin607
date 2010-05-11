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
        // vue
        vues: $(),
        // Parents
        // Enfants
        log: new Log(this),
        barreOutils: new BarreOutils(this),
        blocs: [],
        scratch: null,
        // Ajout
        ajouterVue: function(v) {
            v.modèle = this;
            v.addTo(this.vues);
        },
        ajouterBloc: function(b) {
            b.monde = this;
            this.blocs.push(b);
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
    this.scratch = {vues: this.vues};
}

function BarreOutils(monde) {
    $.extend(this, {
        monde: monde,
        vues: [],
        ajouterVue: function(v) {
            v.modèle = this;
            this.vues.push(v);
        },
    });
}

function Log(monde) {
    $.extend(this, {
        monde: monde,
        vues: [],
        messages: [],
        cbMessage: [],
        // Ajout
        ajouterVue: function(v) {
            v.modèle = this;
            this.vues.push(v);
        },
        // ?
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
        // vue
        vues: [],
        // Parents
        monde: null,
        // Utilisation
        instances: [],
        // Enfants
        définitions: [],
        portsEntree: [],
        portsSortie: [],
        // Ajout
        ajouterVue: function(v) {
            v.modèle = this;
            v.addTo(this.vues);
        },
        ajouterInstance: function(ib) {
            //ib.bloc = this;
            this.instances.push(ib);
        },
        ajouterDéfinition: function(d) {
            d.bloc = this;
            this.définitions.push(d);
        },
        nouvelleDéfinition:  function(nom)         { définitions.push(new Définition(nom, this)); },
        nouveauPortEntree:   function()            { portsEntree.push(new Port('entree', this)); },
        nouveauPortSortie:   function()            { portsEntree.push(new Port('entree', this)); },
        //nouvelleInstance:    function(destination) { instances.push(new InstanceBloc(this, destination)); },
        // Suppression
        supprimerDéfinition: function(def)  { définitions.remove(def); },
        supprimerPortEntree: function(port) { portsEntree.remove(port); },
        supprimerPortSortie: function(port) { portsSortie.remove(port); },
        supprimerInstance:   function(inst) { instances.remove(inst); },
        // Modification
        déplacerDéfinition: function(def, position) {
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
        },
        cbAjoutInstanceBloc: [],
        onAjoutInstanceBloc: function(callback) {
            this.cbAjoutInstanceBloc.push(callback);
        }
    });
}

function InstanceBloc(bloc, définitionParente) {
    $.extend(this, {
        uid: singleton.uid(),
        // Propriétés
        bloc: bloc,
        // vue
        vues: [],
        // Parents
        définition: définitionParente,
        // Enfants
        //instancesPorts: [],
        // Ajout
        ajouterVue: function(v) {
            v.modèle = this;
            v.addTo(this.vues);
        },
    });
}

function Définition(nom, blocParent) {
    $.extend(this, {
        uid: singleton.uid(),
        // Propriétés
        nom: nom,
        type: null,
        //description: '',
        // vue
        vues: [],
        // Parents
        bloc: blocParent,
        // Enfants
        connexions: [],
        instancesBlocs: [],
        // Ajout
        ajouterInstanceBloc: function(ib) {
            ib.définition = this;
            this.instancesBlocs.push(ib);
        },
        ajouterConnexion: function(c) {
            c.définition = this;
            this.connexion.push(c);
        },
    });
}

function Connexions(de, vers, définitionParente) {
    $.extend(this, {
        uid: singleton.uid(),
        // Propriétés
        de: de,
        vers: vers,
        // vue
        vues: [],
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
        // vue
        vues: [],
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
        // vue
        vues: [],
        // Parents
        instanceBloc: instanceBlocParente,
        // Enfants
        liens: []
    });
}*/