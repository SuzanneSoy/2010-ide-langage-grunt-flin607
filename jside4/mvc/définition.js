function MDéfinition() {
    makeUid(this);
    makeField(this, 'mTitreDéfinition', new MTitreDéfinition());
    makeCollection(this, 'instancesBlocs');
    makeCollection(this, 'connexions');
}

function VDéfinition(mDéfinition, emplacement) {
    makeView(this, 'vDéfinition', emplacement, 'vContenu');
    
    var vInstancesBlocsFilles = [];
    var that = this;
    
    // Actions
    this.visible = function(val) {
        if (val) that.vue.show();
        else that.vue.hide();
    };
    
    this.ajoutInstanceBloc = function(_mDéfinition, mInstanceBloc) {
        mInstanceBloc.dansDéfinition = mDéfinition; // TODO hack
        var vib = new VInstanceBloc(mInstanceBloc, that.parties.vContenu);
        vInstancesBlocsFilles.push(vib);
    };

    this.ajoutConnexion = function(_mDéfinition, mConnexion) {
        console.log(mConnexion);
        if (!mConnexion.deBloc()) {
            for (i = 0; i < vInstancesBlocsFilles.length; i++) {
                console.log(vInstancesBlocsFilles[i]);
            }
        }
        /*var mvic = new MVInstanceConnexion(null, vib.vue, vib2.vue); */
        /*new VInstanceConnexion(mvic, $('#éditeur')); */
    }
    
    this.vueNormale = function() {
    }
    
    // Binding
    mDéfinition.onAddInstancesBlocs(this.ajoutInstanceBloc);
    for (var i = 0; i < mDéfinition.instancesBlocs.length; i++) {
        this.ajoutInstanceBloc(mDéfinition, mDéfinition.instancesBlocs[i]);
    }
    
    mDéfinition.onAddConnexions(this.ajoutConnexion);
    for (var i = 0; i < mDéfinition.connexions.length; i++) {
        this.ajoutConnexion(mDéfinition, mDéfinition.connexions[i]);
    }
    
    // Défauts
    this.vueNormale();
}