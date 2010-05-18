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

function VDéfinition(vDéfinitionsParente) {
    $.extend(this,(
        $('#vue-définition')
            .jqote({})
            .toDom()));
    this.vTitre = $('#vue-définition-titre').jqote({});
    vDéfinitionsParente.ajoutVDéfinition(this.vTitre, this);
}

function CDéfinition(mDéfinition, vDéfinitionsParente) {
    this.modèle = mDéfinition;
    this.vue = new VDéfinition(vDéfinitionsParente);
    
    var that = this;
    this.vue.zonable({
        start: function() {
        },
        zone: function() {
        },
        end: function(start, end, rect) {
            that.modèle.bloc.monde.outilZone(that, rect, getRectangle(that.vue));
        }
    });
    
    this.modèle.onAjoutInstanceBloc(function(instanceBloc) {
        var cib = new CInstanceBloc(instanceBloc, that.vue);
    });
}
