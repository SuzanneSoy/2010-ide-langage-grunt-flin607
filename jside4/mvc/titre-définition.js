function MTitreDéfinition() {
    makeUid(this);
    makeField(this, 'titre', 'Nom de la définition');
}

function VTitreDéfinition(mTitreDéfinition, emplacement) {
    makeView(this, 'vTitreDéfinition', emplacement, 'vTitre', 'vÉdition', 'vTexte', 'vSubmit', 'vCancel');
    
    var that = this;
    
    // Actions
    this.updateTitreDéfinition = function(mTitreDéfinition, titre) {
        that.parties.vTitre.text(titre);
        that.parties.vTexte.val(titre);
    };
    
    this.editerTitreDéfinition = function() {
        that.parties.vTitre.hide();
        that.parties.vÉdition.show();
    };
    
    this.accepteÉditionTitreDéfinition = function() {
        mTitreDéfinition.titre(that.parties.vTexte.val());
        that.vueNormale();
    };
    
    this.anuleÉditionTitreDéfinition = function() {
        that.parties.vTexte.val(mTitreDéfinition.titre());
        that.vueNormale();
    };
    
    this.vueNormale = function() {
        that.parties.vTitre.show();
        that.parties.vÉdition.hide();
    };

    this.active = function(val) {
        if (val) that.vue.addClass('active');
        else that.vue.removeClass('active');
    };
    
    // Binding
    mTitreDéfinition.onChangeTitre(this.updateTitreDéfinition);
    this.updateTitreDéfinition(mTitreDéfinition, mTitreDéfinition.titre());
    
    that.parties.vTitre.dblclick(this.editerTitreDéfinition);
    
    that.parties.vCancel.click(this.anuleÉditionTitreDéfinition);
    
    that.parties.vÉdition.submit(function(e) {
        that.accepteÉditionTitreDéfinition();
        return false;
    });
    
    // Défauts
    this.vueNormale();
}