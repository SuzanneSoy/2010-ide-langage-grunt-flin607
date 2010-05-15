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
    $.extend(this,(
        $('#vue-définition')
            .jqote({})
            .toDom()));
    this.vTitre = $('#vue-définition-titre').jqote({});
    vInstanceBlocParente.ajoutVDéfinition(this.vTitre, this);
    
    this.append(blablabla++); // Debug
}

function CDéfinition(mDéfinition, vInstanceBlocParente) {
    this.modèle = mDéfinition;
    this.vue = new VDéfinition(vInstanceBlocParente);
    
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
