function uiActualiserLien(_de, _vers, segments) {
    if ($(_de).centerX() < $(_vers).centerX()) {
        de = $(_de);
        vers = $(_vers);
    } else {
        de = $(_vers);
        vers = $(_de);
    }
    segments = $(segments);
    var segment1 = segments.find('.segment-1');
    var segment2 = segments.find('.segment-2');
    var segment3 = segments.find('.segment-3');
    
    $(segment1)
        .width((vers.centerX() - de.centerX()) / 2)
        .position({my: 'left center', at: 'center', of: de});
    $(segment3)
        .width((vers.centerX() - de.centerX()) / 2)
        .position({my: 'right center', at: 'center', of: vers});
    
    var neg = segment3.centerY() - segment1.centerY();
    
    $(segment2)
        .height((neg > 0) ? segment3.bottomY() - segment1.topY() : segment1.bottomY() - segment3.topY())
        .position({
            my: (neg > 0) ? 'center top' : 'center bottom',
            at: (neg > 0) ? 'right top'  : 'right bottom',
            of: (neg > 0) ? segment1     : segment1
        });
}

function uiLierBlocs() {
    if (!lienBlocsActif.actif) {
        log("Début lien blocs");
        lienBlocsActif.actif = true;
        
        var segments = $('#modele-lien-blocs')
            .jqote()
            .toDom()
            .appendTo($('body'));
        
        var start = $(this);
        
        var elems = $(this)
            .parents(".editionBloc")
            .add(segments);
        
        lienBlocsActif.start = start;
        lienBlocsActif.elems = elems;
        lienBlocsActif.segments = segments;
        
        elems.bind('mousemove.creerLien', function (event) {
            uiActualiserLien(start, event, segments);
        });
        elems.bind('mousedown.creerLien', function (event) {
            log("Fin lien blocs");
            lienBlocsActif.elems.unbind('.creerLien');
            segments.remove();
            lienBlocsActif.actif = false;
            return false;
        });
    } else {
        log("Connexion lien blocs");
        
        // Création du lien
        var lien = {
            start: $(lienBlocsActif.start),
            end: $(this),
            segments: $(lienBlocsActif.segments)
        };
        
        // Un lien a été créé, on est à l'écoute de nouveaux liens
        // (et non plus à l'écoute de la fin d'une connexion)
        lienBlocsActif.elems.unbind('.creerLien');
        lienBlocsActif.actif = false;
        
        debugg = lien;
        if ((lien.start.parents('.bloc:last')[0] == lien.end.parents('.bloc:last')[0])
            || (lien.start.hasClass('entree') && lien.end.hasClass('entree'))
            || (lien.start.hasClass('sortie') && lien.end.hasClass('sortie'))) {
            log("abc");
            lien.segments.remove();
            return;
        }
        
        // Mise à jour des positions des segments lors des drag, etc.
        $(lien.start).parents('.bloc:last')
            .add($(lien.end).parents('.bloc:last'))
            .bind('reduire dragstart drag dragstop resizestart resize resizestop', function (event) {
                uiActualiserLien(lien.start, lien.end, lien.segments);
            });
        
        // Et on re-dessine le lien bien en place maintenant que la cible
        // est un port et non plus la souris.
        uiActualiserLien(lien.start, lien.end, lien.segments);
    }
    
    return false;
}
