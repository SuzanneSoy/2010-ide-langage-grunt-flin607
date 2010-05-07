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

function logEval() {
    window.setTimeout(function () {
        cmd = $('#log-cmdline');
        log("> " + cmd.val());
        v = eval(cmd.val());
        if (typeof v == 'object') {
            if (v.length !== undefined) {
                str = v.length + ' : [';
                for (i = 0; i < v.length - 1; i++) {
                    str += v[i] + ', ';
                }
                if (v.length > 0) {
                    str += v[v.length - 1];
                }
                log(str + ']');
            } else {
                str = "";
                for (i in v) {
                    str += ' ' + i + ':' + v[i];
                }
                log(str);
            }
        } else {
            log(v);
        }
        //cmd.val('');
        cmd.focus();
    }, 0);
    return false;
}