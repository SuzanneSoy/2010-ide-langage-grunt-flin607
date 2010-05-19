function MDéfinition() {
    makeUid(this);
    makeField(this, 'mTitreDéfinition', new MTitreDéfinition());
    makeCollection(this, 'instancesBlocs');
    makeCollection(this, 'connexions');
}

function findVPort(vInstancesBlocsFilles, mPort) {
    for (var i = 0; i < vInstancesBlocsFilles.length; i++) {
        var jtab = [vInstancesBlocsFilles[i].vBloc.vpe, vInstancesBlocsFilles[i].vBloc.vps];
        for (var j = 0; j < jtab.length; j++) {
            var ktab = jtab[j].vPortsFilles;
            for (var k = 0; k < ktab.length; ktab++) {
                if (ktab[k].mPort == mPort) return ktab[k];
            }
        }
    }
}

function findVPortBis(vInstancesBlocsFilles, mPort) {
    for (var i = 0; i < vInstancesBlocsFilles.length; i++) {
        var jtab = [vInstancesBlocsFilles[i].vBloc.vpe, vInstancesBlocsFilles[i].vBloc.vps];
        for (var j = 0; j < jtab.length; j++) {
            var ktab = jtab[j].vPortsFilles;
            for (var k = 0; k < ktab.length; ktab++) {
                if (ktab[k].mPort == mPort) return ktab[k];
            }
        }
    }
}

function VDéfinition(mDéfinition, emplacement, vInstanceBlocParente) {
    makeView(this, 'vDéfinition', emplacement, 'vTypeJs', 'vTypeD', 'vContenuJs', 'vCodeJs', 'vContenu');
    
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
            var deVPort = findVPort(vInstancesBlocsFilles, mConnexion.deMPort());
        } else {
            var deVPort = findVPort([vInstanceBlocParente], mConnexion.deMPort());
        }
        if (!mConnexion.versBloc()) {
            var versVPort = findVPort(vInstancesBlocsFilles, mConnexion.versMPort());
        } else {
            var versVPort = findVPort([vInstanceBlocParente], mConnexion.versMPort());
        }
        var mvic = new MVInstanceConnexion(null, deVPort.vue, versVPort.vue);
        new VInstanceConnexion(mvic, $('#éditeur'));
    }
    
    this.estTypeJs = false;
    this.vueNormale = function() {
        if (that.estTypeJs) {
            that.parties.vTypeJs.hide();
            that.parties.vContenu.hide();
            that.parties.vTypeD.show();
            that.parties.vContenuJs.show();
        } else {
            that.parties.vTypeJs.show();
            that.parties.vContenu.show();
            that.parties.vTypeD.hide();
            that.parties.vContenuJs.hide();
        }
    }
    
    this.typeJavaScript = function() {
        that.estTypeJs = true;
        that.vueNormale();
    };
    
    this.typeDataflow = function() {
        that.estTypeJs = false;
        that.vueNormale();
    };
    
    // Binding
    mDéfinition.onAddInstancesBlocs(this.ajoutInstanceBloc);
    for (var i = 0; i < mDéfinition.instancesBlocs.length; i++) {
        this.ajoutInstanceBloc(mDéfinition, mDéfinition.instancesBlocs[i]);
    }
    
    mDéfinition.onAddConnexions(this.ajoutConnexion);
    for (var i = 0; i < mDéfinition.connexions.length; i++) {
        this.ajoutConnexion(mDéfinition, mDéfinition.connexions[i]);
    }
    
    that.parties.vTypeJs.click(this.typeJavaScript);
    that.parties.vTypeD.click(this.typeDataflow);
    
    // Défauts
    this.vueNormale();
}