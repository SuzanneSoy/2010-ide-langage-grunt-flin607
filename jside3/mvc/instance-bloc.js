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
        $('#vue-bloc')
            .jqote({})
            .appendTo(vDéfinitionParente)));

    this.vBarreTitre = this.find('.barre-titre');
    this.vTitre = this.find('.titre');
    this.vBoutonNouvelleDéfinition = this.find('.nouvelle-définition');
    this.vTitresTabs = this.find('.bloc.tabs.titres');
    this.vDéfinitions = this.find('.définitions');
    this.vAucuneDéfinition = this.find('.aucune-définition');

    this.aucuneDéfinition = true;
    
    var that = this;
    this.ajoutVDéfinition = function(vTitreDéfinition, vDéfinition) {
        if (this.aucuneDéfinition) {
            this.vAucuneDéfinition.hide();
            this.aucuneDéfinition = false;
        }
        var vD = vDéfinition.appendTo(this.vDéfinitions);
        var vTD = vTitreDéfinition.appendTo(this.vTitresTabs);
        
        vTD.click(function() {
            that.changerTab(vTD, vD);
        });
        this.changerTab(vTD, vD);
        return vD;
    };
    
    this.changerTab = function(titreTab, contenuTab) {
        this.vDéfinitions.children().hide();
        this.vTitresTabs.children().removeClass("active");
        titreTab.addClass("active");
        contenuTab.show();
    };
    
    this.draggable();
    this.resizable();
    this.vTitresTabs.css('top', this.vBarreTitre.outerHeight());
    this.vDéfinitions.css('top', this.vBarreTitre.outerHeight() + this.vTitresTabs.outerHeight());
}

function CInstanceBloc(mInstanceBloc, vDéfinitionParente) {
    this.modèle = mInstanceBloc;
    this.vue = new VInstanceBloc(vDéfinitionParente);
    
    var that = this;
    (this.vue.vBoutonNouvelleDéfinition)
        .click(function() {
            that.modèle.bloc.monde.log.envoiMessage("Nouvelle définition.");
            var md = new MDéfinition();
            that.modèle.bloc.ajouterDéfinition(md);
        });
    
    this.modèle.bloc.onAjoutDéfinition(function(définition) {
        that.modèle.bloc.monde.log.envoiMessage("Ajout de définition", définition);
        new CDéfinition(définition, that.vue);
    });
}
