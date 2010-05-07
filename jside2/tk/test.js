$(function () {
    $('#test-ui-layout').layout({ applyDefaultStyles: true });
    $('#test-ui-layout').children('.ui-layout-north').draggable();
    
    var outer = 0;
    $('#test-js-layout')
        .each(function (i, e) {
            if ($(e).is('.auto-height')) {
                outer += $(e).outerHeight() - $(e).innerHeight();
            }
        });
    
    var container =
        $('#test-js-layout');
    var total = (container)
        .innerHeight();
    var minus = (container)
        .children(':not(.auto-height)')
        .invoke('outerHeight', true)
        .sum();
    var nbshares = (container)
        .children('.auto-height')
        .size();
    
    (container)
        .children('.auto-height')
        .height((total - minus) / nbshares);
});
