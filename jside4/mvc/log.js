function MLog() {
    $.extend(this, {
        uid: singleton.uid(),
        
        // Parents
        monde: null,
        
        // Enfants
        messages: [],
        
        // Instanciation
        instances: [],
        demanderInstance: function() {
            var mil = new MInstanceLog();
            mil.log = this;
            this.instances.push(mil);
            return mil;
        },
        
        // Ajout
        envoiMessage: function(msg) {
            this.messages.push(msg);
            faireCallbacks(this.cbMessage, msg);
        },
        
        // Évènements
        cbMessage: [],
        onMessage: function(callback) {
            this.cbMessage.push(callback);
        }
    });
}
