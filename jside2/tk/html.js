(function($) {
    var htmlElements = [
        'div', 'span',
        'table', 'thead', 'tbody', 'tr', 'th', 'td', 'tfoot',
    ];
    
    $.each(htmlElements, function(i, elem) {
        widget(tk, elem, function(_) {
            _.options(
                'class', ''
            );
            
            return $('<' + elem + '/>', this).append(_('rest'));
        });
    });
})(jQuery);