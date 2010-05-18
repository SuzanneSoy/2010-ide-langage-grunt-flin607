function MInstanceLog() {
    $.extend(this, {
        uid: singleton.uid(),
        // Propriétés
        log: null,
        pause: false
    });
}

function VInstanceLog(vMondeParente) {
    $.extend(this,(
        $('#vue-log')
            .jqote({})
            .appendTo(vMondeParente)));
    
    this.vBarreTitre = this.find('.barre-titre');
    this.vTitre = this.find('.titre');
    this.vBoutonPause = this.find('.log.pause');
    this.vBoutonPlay = this.find('.log.play');
    this.vMessages = this.find('.messages');
    
    this.doPlay = function() {
        this.vMessages.stop().scrollToLast(200);
        this.vBoutonPause.show();
        this.vBoutonPlay.hide();
    };
    this.doPause = function() {
        this.vMessages.stop();
        this.vBoutonPause.hide();
        this.vBoutonPlay.show();
    };
    this.ajoutMessage = function(msg, scroll) {
        this.vMessages.append($('<div/>').text(msg));
        if (scroll) this.vMessages.stop().scrollToLast(100);
    }
    
    this.draggable();
    this.resizable();
    this.vMessages.css('top', this.vBarreTitre.outerHeight());
    this.doPlay();
}

function CInstanceLog(mInstanceLog, vMondeParente) {
    this.modèle = mInstanceLog;
    this.vue = new VInstanceLog(vMondeParente);
    
    var that = this;
    this.vue.vBoutonPause.add(this.vue.vBoutonPlay)
        .click(function() {
            if (that.modèle.pause) {
                that.modèle.pause = false;
                that.vue.doPlay();
            } else {
                that.modèle.pause = true;
                that.vue.doPause();
            }
        });

    this.modèle.log.onMessage(function(msg) {
        that.vue.ajoutMessage(msg, !that.modèle.pause)
    });
}
