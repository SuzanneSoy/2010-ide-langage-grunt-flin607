function VPortInPorts(vPortsParente, vPortFille, modèle) {
    var pip = $('#vue-port-in-ports').jqote({}).toDom();
    var ph1 = $('#vue-port-placeholder').jqote().toDom();
    var ph2 = $('#vue-port-placeholder').jqote().toDom();
    $.extend(this, pip.add(ph1).add(ph2));
    this.pip = pip;
    this.ph1 = ph1;
    this.ph2 = ph2;
    
    vPortsParente.vPorts.append(this.ph1).append(this.pip).append(this.ph2);
    
    this.pip.target = this.pip.find('.port-target');
    this.ph1.box = ph1.find('.port.placeholder.vBox');
    this.ph2.box = ph2.find('.port.placeholder.vBox');
    this.ph1.td = ph1.find('.port.placeholder.vTd');
    this.ph2.td = ph2.find('.port.placeholder.vTd');
    
    this.pip.target.append(vPortFille);
    this.ph1.hide();
    this.ph2.hide();
    
    var a1 = ph1.box.stepAnimateClass('active', '');
    var a2 = ph2.box.stepAnimateClass('active', '');
    //var animProxy = function() {};
    var targetMiddle = 0;
    var insertBefore = false;
    var dragProxy = null;

    var that = this;
    var upOrDown = function(e) {
        if (e.pageY < targetMiddle) {
            insertBefore = true;
            // Glow when we get close
            var h1 = that.ph1.td.height() / 2;
            var dist1 = e.pageY - that.ph1.box.offY() + (that.ph1.box.height() / 2);
            var factor1 = Math.min(1, Math.abs(dist1 / h1));
            a1(Math.sqrt(factor1));
            //animProxy(Math.sqrt(factor1));
            // Hide and seek
            that.ph1.show();
            that.ph2.hide();
        } else {
            insertBefore = false;
            // Glow when we get close
            var h2 = that.ph2.td.height() / 2;
            var dist2 = e.pageY - that.ph2.box.offY() + (that.ph2.box.height() / 2);
            var factor2 = Math.min(1, Math.abs(dist2 / h2));
            a2(Math.sqrt(factor2));
            //animProxy(Math.sqrt(factor2));
            // Hide and seek
            that.ph1.hide();
            that.ph2.show();
        }
    };
    
    this.pip.target.bind('dropstart', function(e) {
        targetMiddle = that.pip.target.offY()
            + (that.pip.target.height() / 2);
        /* dragProxy = e.dragProxy;
         * animProxy = $(dragProxy).stepAnimateClass('active', ''); */
        $('body').bind('mousemove', upOrDown);
        upOrDown(e);
    }); 
    this.pip.target.bind('drop', function(e) {
        e.dragTarget.droppedOn(modèle, 1); // il faut mettre la vraie position (utiliser insertBefore)
    });
    this.pip.target.bind('dropend', function(e) {
        that.ph1.hide();
        that.ph2.hide();
        $('body').unbind('mousemove', upOrDown);
    });
}