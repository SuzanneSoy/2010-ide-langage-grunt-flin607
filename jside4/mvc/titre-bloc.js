function MTitreBloc() {
    makeUid(this);
    makeField(this, 'titre', 'Nom du Bloc');
}

function VTitreBloc(mTitreBloc, emplacement) {
    makeView(this, 'vTitreBloc', emplacement, 'vTitre', 'vÉdition', 'vTexte', 'vSubmit', 'vCancel');
    
    var that = this;
    
    // Actions
    this.updateTitreBloc = function(mTitreBloc, titre) {
        that.parties.vTitre.text(titre);
        that.parties.vTexte.val(titre);
    };
    
    this.editerTitreBloc = function() {
        that.parties.vTitre.hide();
        that.parties.vÉdition.show();
    };
    
    this.accepteÉditionTitreBloc = function() {
        mTitreBloc.titre(that.parties.vTexte.val());
        that.vueNormale();
    };
    
    this.anuleÉditionTitreBloc = function() {
        that.parties.vTexte.val(mTitreBloc.titre());
        that.vueNormale();
    };
    
    this.vueNormale = function() {
        that.parties.vTitre.show();
        that.parties.vÉdition.hide();
    };
    
    // Binding
    mTitreBloc.onChangeTitre(this.updateTitreBloc);
    this.updateTitreBloc(mTitreBloc, mTitreBloc.titre());
    
    that.parties.vTitre.dblclick(this.editerTitreBloc);
    
    that.parties.vCancel.click(this.anuleÉditionTitreBloc);
    
    that.parties.vÉdition.submit(function(e) {
        that.accepteÉditionTitreBloc();
        return false;
    });
    
    // Défauts
    this.vueNormale();
}