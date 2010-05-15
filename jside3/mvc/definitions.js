/* Pas de modèle pour définitions: c'est juste une partie de instanceBloc */

function VDéfinitions(vInstanceBlocParente) {
    $.extend(this,(
        $('#vue-définitions')
            .jqote({})
            .appendTo(vInstanceBlocParente)));
    
    this.vTitresTabs = this.find('.définitions.vTitresTabs');
    this.vBoutonNouvelleDéfinition = this.find('.définitions.vNouvelle-définition');
    
    this.vContenusTabs = this.find('.définitions.vContenusTabs');
    this.vTitreAucuneDéfinition = this.find('.définition.vTitre.vAucune-définition');
    this.vCorpsAucuneDéfinition = this.find('.définition.vCorps.vAucune-définition');
    
    this.aucuneDéfinition = true;
    
    var that = this;
    this.ajoutVDéfinition = function(vTitreDéfinition, vCorpsDéfinition) {
        if (this.aucuneDéfinition) {
            this.vTitreAucuneDéfinition.hide();
            this.aucuneDéfinition = false;
        }
        var vtd = $(vTitreDéfinition).insertBefore(this.vTitresTabs.children('.clearfloat')); // hack…
        var vcd = vCorpsDéfinition.appendTo(this.vContenusTabs);
        
        vtd.click(function() {
            that.changerTab(vtd, vcd);
        });
        this.changerTab(vtd, vcd);
        return vcd;
    };

    this.changerTab = function(titreTab, contenuTab) {
        this.vTitresTabs.children().removeClass("active");
        this.vContenusTabs.children().hide();
        titreTab.addClass("active");
        contenuTab.show();
    };
    
    this.vContenusTabs.css('top', this.vTitresTabs.outerHeight());
}

function CDéfinitions(mInstanceBloc, vInstanceBlocParente) {
    this.modèle = mInstanceBloc;
    this.vue = new VDéfinitions(vInstanceBlocParente);
    
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
