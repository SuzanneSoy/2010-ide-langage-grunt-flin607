function MPort(mListePorts) {
    makeUid(this);
    makeField(this, 'mListePorts', mListePorts);
    //makeField(this, 'connexionEntrante', null); // Oui mais… quand on a plusieurs définitions
    //makeCollection(this, 'connexionsSortantes');
}

function VPort(mPort, emplacement) {
    makeView(this, 'vPort', emplacement);
    
    this.mPort = mPort;
    var that = this;
    
    this.cbClick = [];
    
    this.vue.click(function() {
        singleton.portClickA.mPort = mPort;
        faireCallbacks(that.cbClick, mPort);
    });

    this.onClick = function(callback) {
        that.cbClick.push(callback);
    };
}