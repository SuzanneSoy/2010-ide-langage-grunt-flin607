function MVTabsDéfinitions(mListeDéfinitions) { // Modèle ou vue ???
    makeUid(this);
    this.mListeDéfinitions = mListeDéfinitions;
    makeField(this, 'définitionActive', 0);
}

debugctr = 0;
function VTitresTabsDéfinitions(mvTabsDéfinitions, emplacement) {
    makeView(this, 'vTitresTabsDéfinitions', emplacement, 'vTitresTabs', 'vTitreAucuneDéfinition', 'vNouvelleDéfinition');
    
    var listeVues = {};
    var that = this;
    
    // Actions
    this.actionNouvelleDéfinition = function() {
        mvTabsDéfinitions.mListeDéfinitions.addDéfinitions(new MDéfinition());
    };
    
    this.ajoutDéfinition = function(mListeDéfinitions, mDéfinition) {
        var vtd = new VTitreDéfinition(mDéfinition.mTitreDéfinition(), that.parties.vTitresTabs);
        mvTabsDéfinitions.définitionActive(mDéfinition);
        vtd.vue.click(function(){ // TODO : pas propre, devrait être vtd.onClick().
            mvTabsDéfinitions.définitionActive(mDéfinition);
        })
        listeVues[mDéfinition.uid] = vtd;
        that.vueNormale();
    };
    
    this.switchDéfinition = function(_mvTabsDéfinitions, _définitionActive) {
        for (var i in listeVues)
            listeVues[i].active(i == mvTabsDéfinitions.définitionActive().uid);
    };
    
    this.vueNormale = function() {
        if (mvTabsDéfinitions.mListeDéfinitions.définitions.length == 0) {
            that.parties.vTitreAucuneDéfinition.show();
        } else {
            that.parties.vTitreAucuneDéfinition.hide();
        }
        that.switchDéfinition();
    };
    
    // Binding
    mvTabsDéfinitions.mListeDéfinitions.onAddDéfinitions(this.ajoutDéfinition);
    var mld = mvTabsDéfinitions.mListeDéfinitions;
    for (var i = 0; i < mld.définitions.length; i++) {
        this.ajoutDéfinition(mld, mld.définitions[i]);
    }

    mvTabsDéfinitions.onChangeDéfinitionActive(this.switchDéfinition);
    
    this.parties.vNouvelleDéfinition.click(this.actionNouvelleDéfinition);
    
    // Défauts
    this.vueNormale();
}

function VContenusTabsDéfinitions(mvTabsDéfinitions, emplacement) {
    makeView(this, 'vContenusTabsDéfinitions', emplacement, 'vContenusTabs', 'vContenuAucuneDéfinition');
    
    var listeVues = {};
    var that = this;
    
    // Actions
    this.ajoutDéfinition = function(mListeDéfinitions, mDéfinition) {
        var vd = new VDéfinition(mDéfinition, that.parties.vContenusTabs);
        listeVues[mDéfinition.uid] = vd;
        that.vueNormale();
    };
    
    this.switchDéfinition = function(_mvTabsDéfinitions, _définitionActive) {
        for (var i in listeVues)
            listeVues[i].visible(i == mvTabsDéfinitions.définitionActive().uid);
    };

    this.vueNormale = function() {
        if (mvTabsDéfinitions.mListeDéfinitions.définitions.length == 0) {
            that.parties.vContenuAucuneDéfinition.show();
        } else {
            that.parties.vContenuAucuneDéfinition.hide();
        }
        that.switchDéfinition();
    };
    
    // Binding
    mvTabsDéfinitions.mListeDéfinitions.onAddDéfinitions(this.ajoutDéfinition);
    mvTabsDéfinitions.onChangeDéfinitionActive(this.switchDéfinition);
    
    // Défauts
    this.vueNormale();
}