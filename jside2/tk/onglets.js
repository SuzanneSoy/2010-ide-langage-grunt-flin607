(function($) {
    widget(tk, {
        onglets: function(_) {
            _.options();
            
            _.vcontainer('', [1],
                         _.hcontainer('', [1,2],
                                      _.div('', 'tab1'),
                                      _.div('', 'tab2')),
                         _.div("", 'tab1Contenu'),
                         _.div("", 'tab2Contenu')).width('100%');
        }
    });
})(jQuery);