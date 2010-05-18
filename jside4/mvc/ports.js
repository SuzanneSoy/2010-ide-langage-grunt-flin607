function MPorts(mBlocParent, estEntrée) {
    $.extend(this, {
        uid: singleton.uid(),
        // Propriétés
        entrée: estEntrée, /* entrée / sortie */
        // Parents
        bloc: mBlocParent,
        // Ajout
        ports: [],
        ajouterPort: function(p) {
            p.bloc = this;
            p.entrée = estEntrée;
            this.ports.push(p);
            faireCallbacks(this.cbAjoutPort, p);
            //faireCallbacks(this.cbModification, this);
        },
        cbAjoutPort: [],
        onAjoutPort: function(callback) {
            this.cbAjoutPort.push(callback);
        }
    });
}

function VPorts(vDéfinitionsParente, sens, mPorts) {
    $.extend(this,(
        $('#vue-ports-'+sens)
            .jqote({})
            .toDom()));
    
    this.vVerticalBar = this.find('.ports.vVerticalBar');
    this.vPorts = this.find('.ports.vPorts');
    
    var that = this;
    this.addVPort = function(vPort, mPorts) {
        new VPortInPorts(this, vPort, mPorts);
    };
    
    vDéfinitionsParente.setVPorts(this, sens);
    
    var ph0 = $('#vue-port-placeholder').jqote().appendTo(this.vPorts);
    this.ph0 = ph0;
    this.ph0.box = this.ph0.find('.port.placeholder.vBox');
    this.ph0.td = ph0.find('.port.placeholder.vTd');
    var a0 = ph0.box.stepAnimateClass('active', '');
    this.ph0.hide();
    var dragProxy = null;
    
    var showDistance = function (e) {
        // Glow when we get close
        var h0 = that.ph0.td.height() / 2;
        var dist0 = e.pageY - that.ph0.box.offY() + (that.ph0.box.height() / 2);
        var factor0 = Math.min(1, Math.abs(dist0 / h0));
        a0(Math.sqrt(factor0));
    };
    this.addClass('port-target');
    var dropstartFunc = function(e) {
        that.ph0.show();
        $('body').bind('mousemove', showDistance);
        showDistance(e);
    };
    var dropFunc = function(e) {
        e.dragTarget.droppedOn(mPorts, 0); // Position 0, car actuellement il n'y a rien.
    };
    var dropendFunc = function(e) {
        that.ph0.hide();
        $('body').unbind('mousemove', showDistance);
    };

    this.bindForDrops = function(bind) {
        if (bind) {
            this.bind('dropstart', dropstartFunc);
            this.bind('drop', dropFunc);
            this.bind('dropend', dropendFunc);
        } else {
            this.unbind('dropstart', dropstartFunc);
            this.unbind('drop', dropFunc);
            this.unbind('dropend', dropendFunc);
        }
    }
    this.bindForDrops(true);
}

function CPorts(mInstanceBloc, vDéfinitionsParente) {
    this.modèle= mInstanceBloc;
    this.mEntrée = mInstanceBloc.bloc.mPortsEntrée;
    this.mSortie = mInstanceBloc.bloc.mPortsSortie;
    this.vEntrée = new VPorts(vDéfinitionsParente, 'entrée', this.mEntrée);
    this.vSortie = new VPorts(vDéfinitionsParente, 'sortie', this.mSortie);

    var that = this;
    this.mEntrée.onAjoutPort(function(mPort) {
        console.log("Ajout de port d'entrée", mPort);
        that.modèle.bloc.monde.log.envoiMessage("Ajout de port d'entrée " + mPort);
        new CPort(mPort, that.vEntrée);
        window.setTimeout(function() {that.vEntrée.bindForDrops(false)}, 0);
    });
    this.mSortie.onAjoutPort(function(mPort) {
        console.log("Ajout de port de sortie", mPort);
        that.modèle.bloc.monde.log.envoiMessage("Ajout de port de sortie " + mPort);
        new CPort(mPort, that.vSortie);
        window.setTimeout(function() {that.vSortie.bindForDrops(false);}, 0);
    });
}
