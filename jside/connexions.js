jQuery.fn.preparerBlocConnexions = function(arg) {
    $(this).find('.port')
        .bind('mousedown click', uiLierBlocs);
    
    if (arg == 'edition') {
        $(this).find('table.ports:first > tbody, table.ports:last > tbody')
            .sortable({
                //axis: 'y',
                scroll:   false,
                appendTo: 'body',
                cursorAt: {top:7, left:7}, // Hack-o-matic 7 & 7 pour que le symbole soit centré sous le curseur
                helper: function (ev, elem) {
                    // height: auto pour conter jquery qui force une hauteur malgrè l'option
                    // forceHelperSize: false.
                    return $('<div class="port" style="height: auto"><div class="symbole"/></div>');
                },
                start: function(ev, ui) {
                    $(ui.placeholder)
                        .css('visibility', '')
                        .css('height', '')
                        .append('<td class="port sortie"><div class="symbole placeholder"></td>');
                },
            })
            .bind('sortstart', uiLierBlocs)
            .bind('sort sortstop', function() {
                $(this).parents('.bloc:first').trigger('changer');
            });
    }
    
    return $(this);
}

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

function uiLierBlocs(ev) {
    /* Hack pour ne pas capturer le clic après un sort */
    if (ev.type == 'mousedown') {
        lienBlocsActif.pret = true;
        return true;
    } else if (ev.type == 'sortstart') {
        lienBlocsActif.pret = false;
        return true;
    } else {
        if (!lienBlocsActif.actif && !lienBlocsActif.pret) {
            lienBlocsActif.pret = true;
            return true;
        } else {
            /* Fin du hack non-capture de clic après sort */
            if (!lienBlocsActif.actif) {
                lienBlocsActif.actif = true;
                
                var segments = $('#modele-lien-blocs')
                    .jqote()
                    .toDom()
                    .appendTo($(this).parents('.editionBloc').first());
                
                var start = $(this);
                
                var elems = $(this)
                    .parents(".editionBloc.bloc")
                    .add(segments);
                
                lienBlocsActif.start = start;
                lienBlocsActif.elems = elems;
                lienBlocsActif.segments = segments;
                
                elems.bind('mousemove.creerLien', function (event) {
                    uiActualiserLien(start, event, segments);
                });
                /*elems.bind('mousedown.creerLien', function (event) {*/
                elems.bind('click.creerLien', function (event) {
                    lienBlocsActif.elems.unbind('.creerLien');
                    segments.remove();
                    lienBlocsActif.actif = false;
                    return false;
                });
            } else {
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

                if ((lien.start.parents('.bloc:first')[0] == lien.end.parents('.bloc:first')[0])
                    /*|| (lien.start.hasClass('entree') && lien.end.hasClass('entree'))
                    || (lien.start.hasClass('sortie') && lien.end.hasClass('sortie'))*/) {
                    log("Connexion impossible !");
                    lien.segments.remove();
                    return;
                }
                
                // Mise à jour des positions des segments lors des drag, etc.
                lien.start.parents('.bloc:first')
                    .add(lien.end.parents('.bloc:first'))
                    .bind('changer reduire dragstart drag dragstop resizestart resize resizestop', function (event) {
                        uiActualiserLien(lien.start, lien.end, lien.segments);
                    });
                
                // Et on re-dessine le lien bien en place maintenant que la cible
                // est un port et non plus la souris.
                uiActualiserLien(lien.start, lien.end, lien.segments);
                
                log("Connexion.");
            }
            
            return false;
        }
    }
}
