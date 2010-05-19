function MVInstanceConnexion(mConnexion, vPortA, vPortB) {
    makeUid(this);
    makeField(this, 'mConnexion', mConnexion);
    makeField(this, 'vPortA', vPortA);
    makeField(this, 'vPortB', vPortB);
}

function VInstanceConnexion(mvInstanceConnexion, emplacement) {
    makeView(this, 'vConnexion', emplacement, 'vSegment1', 'vSegment2', 'vSegment3');
    
    var that = this;
    
    // Actions
    this.vueNormale = function() {
        var _de = mvInstanceConnexion.vPortA();
        var _vers = mvInstanceConnexion.vPortB();
        var de, vers;
        if ($(_de).centerX() < $(_vers).centerX()) {
            de = $(_de);
            vers = $(_vers);
        } else {
            de = $(_vers);
            vers = $(_de);
        }
        
        var segment1 = that.parties.vSegment1;
        var segment2 = that.parties.vSegment2;
        var segment3 = that.parties.vSegment3;
        
        $(segment1)
            .width((vers.centerX() - de.centerX()) / 2)
            .position({my: 'left center', at: 'center', of: de});
        $(segment3)
            .width((vers.centerX() - de.centerX()) / 2)
            .position({my: 'right center', at: 'center', of: vers});
        
        var neg = segment3.centerY() - segment1.centerY();
        
        $(segment2)
            .height((neg > 0) ? segment3.bottomY() - segment1.topY() : segment1.bottomY() - segment3.topY())
            .position({
                my: (neg > 0) ? 'center top' : 'center bottom',
                at: (neg > 0) ? 'right top'  : 'right bottom',
                of: (neg > 0) ? segment1     : segment1
            });
    }
    
    // Binding
    // onMove (dePort, versPort) 
    
    // Défauts
    this.vueNormale();
}
