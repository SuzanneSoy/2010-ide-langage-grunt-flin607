/* Pas de modèle pour définitions: c'est juste une partie de instanceBloc */

function VDéfinitions(vInstanceBlocParente) {
    $.extend(this,(
        $('#vue-définitions')
            .jqote({})
            .toDom()));
    vInstanceBlocParente.setVDéfinitions(this);
    
    this.vTitresTabs = this.find('.définitions.vTitresTabs');
    this.vBoutonNouvelleDéfinition = this.find('.définitions.vNouvelle-définition');

    this.vBoutonNouvelleDéfinition.draggable({
        connectToSortable: '#mydiv',
        cancel: '',
        revert: 'invalid',
        helper: function() {
            return new VPort('body');
        }
    }).css('z-index', '1000');
    
    this.vContenus = this.find('.définitions.vContenus');
    this.vContenusTabs = this.find('.définitions.vContenusTabs');
    this.vTitreAucuneDéfinition = this.find('.définition.vTitre.vAucune-définition');
    this.vCorpsAucuneDéfinition = this.find('.définition.vCorps.vAucune-définition');
    
    this.vPortsEntrée = this.find('.définitions.vPorts-entrée');
    this.vPortsSortie = this.find('.définitions.vPorts-sortie');
    
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
        this.ajusterBarreTitres();
        return vcd;
    };

    this.changerTab = function(titreTab, contenuTab) {
        this.vTitresTabs.children().removeClass("active");
        this.vContenusTabs.children().hide();
        titreTab.addClass("active");
        contenuTab.show();
    };

    this.setVPortsEntrée = function(vPortsEntrée) {
        this.vPortsEntrée.replaceWith(vPortsEntrée);
    };
    
    this.setVPortsSortie = function(vPortsSortie) {
        this.vPortsSortie.replaceWith(vPortsSortie);
    };
    
    this.ajusterBarreTitres = function() {
        that.vContenus.css('top', that.vTitresTabs.outerHeight());
    }
    
    this.ajusterBarreTitres();
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
    
    new CPorts(this.modèle, this.vue);
}
