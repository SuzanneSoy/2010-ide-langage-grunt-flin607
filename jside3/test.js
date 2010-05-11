function testlog(m, count) {
    m.log.envoiMessage('Coucou !');
    var fdemo = function() {
        m.log.envoiMessage('Pioute !');
        if (--count > 0)
            window.setTimeout(fdemo, 100);
    }
    window.setTimeout(fdemo, 1000);
}

