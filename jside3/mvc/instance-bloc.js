function MInstanceBloc() {
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

function VInstanceBloc(vDéfinitionParente) {
    $.extend(this,(
        $('#vue-instance-bloc')
            .jqote({})
            .appendTo(vDéfinitionParente)));

    this.vBarreTitre = this.find('.instance-bloc.vBarre-titre');
    this.vTitre = this.find('.instance-bloc.vTitre');
    this.vVueTitre = this.find('.instance-bloc.vVue-titre');
    this.vÉditionTitre = this.find('.instance-bloc.vÉdition-titre');
    this.vChampTitre = this.find('.instance-bloc.vChamp-titre');
    this.vBoutonValiderTitre = this.find('.instance-bloc.vBoutonValiderTitre');
    this.vDéfinitions_ = this.find('.instance-bloc.vDéfinitions'); // quick hack because otherwise tabs titles disapear (???)
    this.vDéfinitions = this.find('.instance-bloc.vDéfinitions');
    
    var that = this;
    this.setVDéfinitions = function(vDéfinitions) {
        this.vDéfinitions_.append(vDéfinitions); // quick hack because otherwise tabs titles disapear (???)
        this.vDéfinitions = vDéfinitions;
    }
    
    this.titre = function(val) {
        if (typeof val != "function") {
            this.vTitre.text(val);
            this.ajusterBarreTitre();
            return true;
        }
        this.vTitre.hide();
        this.vChampTitre.val(this.vTitre.text());
        this.vÉditionTitre.show();
        this.ajusterBarreTitre();
        this.vChampTitre.select();
        var cbModifTitre = val;
        this.vÉditionTitre.submit(function(ev) {
            that.vTitre.show();
            that.vÉditionTitre.hide();
            that.ajusterBarreTitre();
            window.setTimeout(function() {cbModifTitre(that.vChampTitre.val());}, 0);
            return false;
        });
    }
    
    this.ajusterBarreTitre = function() {
        that.vDéfinitions.css('top', that.vBarreTitre.outerHeight());
    }
    
    this.draggable();
    this.resizable({
        resize: function() {
            that.ajusterBarreTitre();
            that.vDéfinitions.ajusterBarreTitres();
        }
    });
    this.vÉditionTitre.hide();
    this.ajusterBarreTitre();
}

function CInstanceBloc(mInstanceBloc, vDéfinitionParente) {
    this.modèle = mInstanceBloc;
    this.vue = new VInstanceBloc(vDéfinitionParente);
    
    var that = this;
    (this.vue.vTitre)
        .dblclick(function() {
            that.vue.titre(function(nouveauNom) {
                that.modèle.bloc.changeNom(nouveauNom);
            });
        });
    
    (this.modèle.bloc)
        .onChangeNom(function(nouveauNom) {
            that.vue.titre(that.modèle.bloc.nom);
        });
    
    this.vue.titre(this.modèle.bloc.nom);
    this.vue.css('left', (this.modèle.rect.x1 - this.modèle.rectParent.x1) / this.modèle.rectParent.width * vDéfinitionParente.width());
    this.vue.css('top', (this.modèle.rect.y1 - this.modèle.rectParent.y1) / this.modèle.rectParent.height * vDéfinitionParente.height());
    this.vue.width(this.modèle.rect.width / this.modèle.rectParent.width * vDéfinitionParente.width());
    this.vue.height(this.modèle.rect.height / this.modèle.rectParent.height * vDéfinitionParente.height());
    
    new CDéfinitions(this.modèle, this.vue);
}
