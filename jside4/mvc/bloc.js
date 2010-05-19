function MBloc() {
    makeUid(this);
    makeField(this, 'mTitreBloc', new MTitreBloc());
    makeField(this, 'mListePortsEntrée', new MListePorts(true));
    makeField(this, 'mListePortsSortie', new MListePorts(false));
    makeField(this, 'mListeDéfinitions', new MListeDéfinitions());
}

function VBloc(mBloc, emplacement, mInstanceBloc_portClick) {
    makeView(this, 'vBloc', emplacement, 'vTitreBloc', 'vListePortsEntrée', 'vListePortsSortie', 'vTitresTabsDéfinitions', 'vContenusTabsDéfinitions');
    new VTitreBloc(mBloc.mTitreBloc(), this.parties.vTitreBloc);
    var vpe = new VListePorts(mBloc.mListePortsEntrée(), this.parties.vListePortsEntrée);
    var vps = new VListePorts(mBloc.mListePortsSortie(), this.parties.vListePortsSortie);
    
    this.mvTabsDéfinitions = new MVTabsDéfinitions(mBloc.mListeDéfinitions());
    
    new VTitresTabsDéfinitions(this.mvTabsDéfinitions, this.parties.vTitresTabsDéfinitions);
    new VContenusTabsDéfinitions(this.mvTabsDéfinitions, this.parties.vContenusTabsDéfinitions);
    
    var that = this;
    var clicsPorts = function(mPort) {
        singleton.portClickA.mInstanceBloc = mInstanceBloc_portClick;
        singleton.portClickA.mDéfinition = that.mvTabsDéfinitions.définitionActive();
        
        if (singleton.portClickB === null) {
            singleton.portClickB = singleton.portClickA;
            singleton.portClickA = {};
        } else {
            var a = singleton.portClickA;
            var b = singleton.portClickB;
            if (a.mPort == b.mPort) {
                // Double clic, afficher la valeur du port
            } else {
                //console.log(singleton.portClickA, singleton.portClickB);
                if (a.mDéfinition.uid == b.mInstanceBloc.dansDéfinition.uid) { // a parent de b
                    if (a.mListePorts.estEntrée) {
                        a.mDéfinition.addConnexions(
                            new MConnexion(true, a.mInstanceBloc, a.mPort, false, b.mInstanceBloc, b.mPort)
                        );
                    } else {
                        a.mDéfinition.addConnexions(
                            new MConnexion(false, b.mInstanceBloc, b.mPort, true, a.mInstanceBloc, a.mPort)
                        );
                    }
                } else if (b.mDéfinition.uid == a.mInstanceBloc.dansDéfinition.uid) { // b parent de a
                    if (a.mListePorts.estEntrée) {
                        a.mDéfinition.addConnexions(
                            new MConnexion(true, a.mInstanceBloc, a.mPort, false, b.mInstanceBloc, b.mPort)
                        );
                    } else {
                        a.mDéfinition.addConnexions(
                            new MConnexion(false, b.mInstanceBloc, b.mPort, true, a.mInstanceBloc, a.mPort)
                        );
                    }
                }
                
                if (a.mInstanceBloc.dansDéfinition.uid == b.mInstanceBloc.dansDéfinition.uid) { // a et b même parent
                    if (a.mListePorts.estEntrée) {
                        a.mInstanceBloc.dansDéfinition.addConnexions(
                            new MConnexion(false, b.mInstanceBloc, b.mPort, false, a.mInstanceBloc, a.mPort)
                        );
                    } else {
                        a.mInstanceBloc.dansDéfinition.addConnexions(
                            new MConnexion(false, a.mInstanceBloc, a.mPort, false, b.mInstanceBloc, b.mPort)
                        );
                    }
                }
            }
            singleton.portClickB = null;
            singleton.portClickA = {};
        }
    }
    
    vpe.onClickPort(clicsPorts);
    vps.onClickPort(clicsPorts);
}