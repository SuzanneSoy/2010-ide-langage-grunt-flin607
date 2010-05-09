(function($) {
    widget(tk, {
        bloc: function(_) {
            _.options(
                'nom',         'Exemple',
                'description', "Un bloc d'exemple"
            );
            
            _.window(this.nom, this.description);
        }
    });
})(jQuery);