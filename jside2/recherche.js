function uiRechercher() { 
    log("Recherche…");
    rechercher($('#nom-bloc').val(), uiEditer);
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

function rechercher(terme, action) {
    action = action || function() {return true;}
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
            .addClass(elem.uid == $w.blocActif ? 'actif' : '')
            .data("uid", elem.uid)
            .click(function () {
                action(elem.uid);
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
