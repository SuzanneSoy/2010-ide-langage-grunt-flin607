function logPauseToggle() {
    if (logPause) {
        $('.log .contenu').stop().scrollTo($('.log .contenu :last'), 200);
        logPause = false;
        $('#log-pause').val("pause");
    } else {
        logPause = true;
        $('.log .contenu').stop();
        $('#log-pause').val("play");
    }
}

function log(msg) {
    var elem = $('.log .contenu').append("<p>"+msg+"</p>");
    if (!logPause) {
        $('.log .contenu').stop().scrollTo($('.log .contenu :last'), 100);
    }
}
