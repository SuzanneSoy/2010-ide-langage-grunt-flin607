function MBarreOutils() {
    $.extend(this, {
        monde: null,
    });
}

function VBarreOutils(vMondeParente) {
    $.extend(this,(
        $('#vue-barre-outils')
            .jqote({})
            .appendTo(vMondeParente)));
    
    this.vBarreTitre = this.find('.barre-titre');
    this.vTitre = this.find('.titre');
    this.vBoutonNouveauBloc = this.find('.nouveau-bloc');
    this.vBoutonRecherche = this.find('.recherche');
    this.vBoutonLog = this.find('.log');
    
    this.draggable();
    this.resizable();
}

function CBarreOutils(mBarreOutils, vMondeParente) {
    this.modèle = mBarreOutils;
    this.vue = new VBarreOutils(vMondeParente);
    
    var that = this;
    (this.vue.vBoutonNouveauBloc)
        .click(function() {
            that.modèle.monde.log.envoiMessage("Cliquez-glissez pour créer un nouveau bloc.");
            that.modèle.monde.outilZone = function(cDéfinition, rect) {
                console.log('Zone sur', cDéfinition, rect.x1, rect.y1, rect.x2, rect.y2, rect.width, rect.height);
                that.modèle.monde.outilZone = that.modèle.monde.actionAucune;
                
                var mb = new MBloc();
                that.modèle.monde.ajouterBloc(mb);
                var mib = mb.demanderInstance();
                cDéfinition.modèle.ajouterInstanceBloc(mib);
            }
/*            var mb = new MBloc();
            that.modèle.monde.ajouterBloc(mb);
            var mib = mb.demanderInstance();
            that.modèle.monde.scratch.ajouterInstanceBloc(mib);*/
        });
    
    (this.vue.vBoutonRecherche)
        .click(function() {
            that.modèle.monde.log.envoiMessage("Nouvelle recherche.");
            var mr = that.modèle.monde.recherche;
            var mir = mr.demanderInstance();
            that.modèle.monde.ajouterInstanceRecherche(mir);
        });
    
    (this.vue.vBoutonLog)
        .click(function() {
            that.modèle.monde.log.envoiMessage("Nouveau log.");
            var ml = that.modèle.monde.log;
            var mil = ml.demanderInstance();
            that.modèle.monde.ajouterInstanceLog(mil);
        });
}
