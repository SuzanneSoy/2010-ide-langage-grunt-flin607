function MDéfinition() {
    $.extend(this, {
        uid: singleton.uid(),
        // Propriétés
        nom: "Nouvelle définition",
        type: null,
        //description: '',
        // Parents
        bloc: null,
        // Enfants
        connexions: [],
        instancesBloc: [],
        // Ajout
        ajouterInstanceBloc: function(ib) {
            ib.définition = this;
            this.instancesBloc.push(ib);
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

blablabla = 0;
function VDéfinition(vInstanceBlocParente) {
    var t = $('#vue-définition-titre').jqote({});
    var d = $('#vue-définition').jqote({}).toDom();
    d.append(blablabla++);
    vInstanceBlocParente.ajoutVDéfinition(t, d)
    $.extend(this,d);
    
    this.mousedown(function(e) {
        console.log("mousedown");
        return false;
    });
}

function CDéfinition(mDéfinition, vInstanceBlocParente) {
    this.modèle = mDéfinition;
    this.vue = new VDéfinition(vInstanceBlocParente);
}
