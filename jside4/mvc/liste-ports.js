function MListePorts(estEntrée) {
    makeUid(this);
    this.estEntrée = estEntrée;
    makeCollection(this, 'ports');
}

function VListePorts(mListePorts, emplacement) {
    makeView(this, 'vListePorts', emplacement, 'vPorts', 'vNouveauPort');
    
    this.cbClickPort = [];
    this.vPortsFilles = [];
    var that = this;
    
    // Actions
    this.actionNouveauPort = function() {
        mListePorts.addPorts(new MPort());
    };
    
    this.clickPort = function(mPort) {
        singleton.portClickA.mListePorts = mListePorts;
        faireCallbacks(that.cbClickPort, mPort);
    };
    
    this.ajoutPort = function(mListePorts, mPort) {
        var vp = new VPort(mPort, that.parties.vPorts);
        that.vPortsFilles.push(vp);
        vp.onClick(that.clickPort);
    };
    
    this.vueNormale = function() {
    }
    
    // Binding
    mListePorts.onAddPorts(this.ajoutPort);
    for (var i = 0; i < mListePorts.ports.length; i++) {
        this.ajoutPort(mListePorts, mListePorts.ports[i]);
    }
    
    this.parties.vNouveauPort.click(this.actionNouveauPort);

    this.onClickPort = function(callback) {
        that.cbClickPort.push(callback);
    };
    
    // Défauts
    this.vueNormale();
}