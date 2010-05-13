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
            that.modèle.monde.log.envoiMessage("Nouveau bloc.");
            var mb = new MBloc();
            that.modèle.monde.ajouterBloc(mb);
            var mib = mb.demanderInstance();
            that.modèle.monde.scratch.ajouterInstanceBloc(mib);
        });
    
    (this.vue.vBoutonLog)
        .click(function() {
            that.modèle.monde.log.envoiMessage("Nouveau log.");
            var ml = that.modèle.monde.log;
            var mil = ml.demanderInstance();
            that.modèle.monde.ajouterInstanceLog(mil);
        });
}
