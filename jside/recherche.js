function uiRechercher() { 
    log("Recherche…");
    rechercher($('#nom-bloc').val());
}

function arreterRecherche() {
    $('#resultats-recherche').hide();
    $('#edition-blocs').show();
}

function demarrerRecherche() {
    $('#resultats-recherche tbody').empty();
    $('#resultats-recherche').show();
    $('#edition-blocs').hide();
}

function rechercher(terme) {
    demarrerRecherche();
    
    $(
        $.grep($w.blocs, function (b) {
            return b.nom.indexOf(terme) >= 0;
        })
    )
    
    .map(function(idx, elem) {
        return $('#modele-resultat-recherche')
            .jqote(elem)
            .toDom()
            .data("uid", elem.uid)
            .click(function() {
                log(elem.uid);
            })
            
            .find('.editer')
            .click(function() {
                arreterRecherche();
                uiEditer(elem.uid);
                return false;
            })
            .end()
        
            .find('.utiliser')
            .click(function() {
                arreterRecherche();
                uiUtiliser(elem.uid);
                return false;
            })
            .end();
    })
    
    .appendTo('#resultats-recherche tbody');
}
