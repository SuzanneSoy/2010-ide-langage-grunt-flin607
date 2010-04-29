function logPauseToggle() {
    if (logPause) {
        $('.log .contenu').stop().scrollTo($('.log .contenu :last'), 200);
        logPause = false;
        $('#log-pause').text("pause");
    } else {
        logPause = true;
        $('.log .contenu').stop();
        $('#log-pause').text("play");
    }
}

function log(msg) {
    var elem = $('.log .contenu').append("<p>"+msg+"</p>");
    if (!logPause) {
        $('.log .contenu').stop().scrollTo($('.log .contenu :last'), 100);
    }
}
