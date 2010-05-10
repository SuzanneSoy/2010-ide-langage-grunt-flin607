$(function(){
    window.setTimeout(test, 100);
});

function test() {
    $('#drag').draggable();
    //$('#drag').selectable();
    
    var b = $('body');
    for (var i = 0; i < 25; i++) {
        for (var j = 0; j < 15; j++) {
            b.prepend('<div class="drop" style="position: absolute; '
                      + 'top:' + (50*j) + 'px;'
                      + 'left: ' + (50*i) + 'px;'
                      + 'height: 1em; width:1em; background-color: lightgray; text-align: center;">×</div>');
        }
    }
    
    $('.drop').droppable({
        tolerance: 'touch',
        hoverClass: 'fermer-actif',
        over: function(event, ui) {
            ui.draggable.addClass('a-detruire');
        },
        out: function(event, ui) {
            ui.draggable.removeClass('a-detruire');
        },
        drop: function(event, ui) {
            ui.draggable.remove();
        }
    });
}