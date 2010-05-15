function MInstanceRecherche() {
    $.extend(this, {
        uid: singleton.uid(),
        // Propriétés
        mRecherche: null,
        termes: '',
        sélection: [],
        ajouterRésultatSélection: function(s) {
            this.sélection.push(s);
            s.ajoutSélection();
        },
        supprimerRésultatSélection: function(s) {
            this.sélection.remove(s);
            s.suppressionSélection();
        },
        effacerSélection: function(s) {
            for (var i = 0; i < this.sélection.length; i++)
                this.sélection[i].suppressionSélection();
            this.sélection = [];
        }
    });
}

function VInstanceRecherche(vMondeParente) {
    $.extend(this,(
        $('#vue-recherche')
            .jqote({})
            .appendTo(vMondeParente)));
    
    this.vBarreTitre = this.find('.barre-titre');
    this.vTitre = this.find('.titre');
    this.vChampTermes = this.find('.termes');
    this.vRésultats = this.find('.résultats');
    this.premièreFois = true;
    this.addClass('première-fois');

    var that = this;
    (this.vChampTermes)
        .focus(function() {
            if (that.premièreFois) {
                that.premièreFois = false;
                that.vChampTermes.val("");
                // TODO : unbind focus
            }
        });
    
    this.ajoutVRésultatRecherche = function(vrr, position) {
        if (position === undefined || position >= this.vRésultats.children().size() - 1) {
            this.vRésultats.append(vrr);
        } else {
            this.vRésultats.children().eq(position).before(vrr);
        }
    };
    
    this.sélection = function(s) {
        this.vRésultats.children.removeClass('sélectionné');
        s.addClass('sélectionné');
    };
    
    this.termes = function(val) {
        if (val !== undefined) {
            this.vChampTermes.val(val);
            this.removeClass('première-fois');
            this.premièreFois = false;
            // TODO : unbind focus
        } else if (this.premièreFois) {
            return "";
        } else {
            return this.vChampTermes.val();
        }
    };
    
    /*this.effacerRésultats = function() {
        this.vRésultats.empty();
    };*/
    
    this.draggable();
    this.resizable();
    this.vRésultats.css('top', this.vBarreTitre.outerHeight());
}

function CInstanceRecherche(mInstanceRecherche, vMondeParente) {
    this.modèle = mInstanceRecherche;
    this.vue = new VInstanceRecherche(vMondeParente);
    this.ancienTerme = "";
    this.anciensRésultats = [];
    
    var that = this;
    (this.vue.vChampTermes)
        .keyup(function() { // keypress ne prend pas en compte le backspace
            that.actualiserRecherche();
        });
    
    (this.modèle.mRecherche.monde)
        .onAjoutBloc(function(bloc) {
            that.actualiserRecherche([bloc], true, true);
        });
    
    (this.modèle.mRecherche.monde)
        .onModificationBloc(function(bloc) {
            that.actualiserRecherche([bloc], true, true);
        });
    
    this.actualiserRecherche = function(domaine, animAjout, animSuppression) {
        var termes = this.vue.termes().toLowerCase().split(" ");
        var domaine = domaine || this.modèle.mRecherche.monde.blocs;
        var résultats = filtrerValeurs(mInstanceRecherche, domaine, termes, function(b) {
            return {
                original: b.nom,
                searchOn: b.nom.toLowerCase()
            };
        });
        
        this.anciensRésultats = fusionRésultats(this.anciensRésultats, domaine, résultats, this.vue, this.modèle, animAjout, animSuppression);
    }
    
    this.actualiserRecherche(null, true, true);
}

/* Fonctions auxiliaires */

function filtrerValeurs(mInstanceRecherche, ensemble, termes, getTexte) {
    var maxres = 50;
    var résultats = [];
    var nbres = 0;
    var ensemble_length = ensemble.length;
    termes = termes.filter(function (e) { return e != ""; });
    
    for (var i = 0; i < ensemble_length; i++) {
        var texte = getTexte(ensemble[i]);
        var mrr = searchAndReturnFormatted(mInstanceRecherche, texte.searchOn, texte.original, termes);
        
        if (mrr !== false) {
            mrr.objet = ensemble[i];
            mrr.uid = ensemble[i].uid;
            résultats.push(mrr);
            nbres++;
            if (nbres >= maxres) break;
        }
    }
    
    résultats.sort(function(a,b){return a.score - b.score});
    for (var i = 0; i<résultats.length; i++) { résultats[i].position = i; }
    return résultats;
}

/* searchAndReturnFormatted("abcdefghijkabcxyz", ["abc", "ef", "cxy"]); */
function searchAndReturnFormatted(mInstanceRecherche, haystack, original, needles) {
    var status = new Array(haystack.length);
    for (var i = 0; i < status.length; i++) {
        status[i] = 0;
    }
    
    for (var n = 0; n < needles.length; n++) {
        var nl = needles[n].length;
        var idx = haystack.indexOf(needles[n]);
        if (idx < 0) {
            // Aucune occurence de needles[n]
            return false;
        }
        while (idx >= 0) {
            for (var i = idx; i < idx + nl; i++) {
                if (status[i] > 0) {
                    for (j = idx; j < idx + nl; j++) {
                        if (j >= i && status[j] >= 1) {
                            status[j] = 3;
                        } else {
                            status[j] = 2;
                        }
                    }
                    i = idx + nl;
                    break;
                }
                status[i] = 1;
            }
            idx = haystack.indexOf(needles[n], i);
        }
    }
    
    var old = -1;
    var str = "";
    for (var i = 0; i < status.length; i++) {
        if (old != status[i]) {
            if (old >= 1)
                str += '</span>';
            if (status[i] == 1) {
                str += '<span class="occurence">';
            } else if (status[i] == 2) {
                str += '<span class="superposée">';
            } else if (status[i] == 3) {
                str += '<span class="superposition">';
            }
        }
        str += original[i];
        old = status[i];
    }
    
    if (old >= 1)
        str += '</span>';
    var mrr = new MRésultatRecherche();
    mrr.mInstanceRecherche = mInstanceRecherche;
    mrr.html = str;
    mrr.score = $.sum(status); // We definitely need a better score calculation…
    return mrr;
}

/* anciens = [] of CRésultatRecherche;
 * domaine = [] of MBloc;
 * nouveaux = [] of MRésultatRecherche;
 * vRechercheParente is a VRechercheParente
 * mInstanceRecherche is a MInstanceRecherche
 * animAjout is a boolean
 * animSuppression is a boolean
 */

function fusionRésultats(anciens, domaine, nouveaux, vRechercheParente, mInstanceRecherche, animAjout, animSuppression) {
    anciens.sort(function(a,b)  { return a.modèle.objet.uid - b.modèle.objet.uid; });
    domaine.sort(function(a,b)  { return a.uid              - b.uid;              });
    nouveaux.sort(function(a,b) { return a.objet.uid        - b.objet.uid;        });
    
    // Ceci est une sorte de tri fusion à trois tableaux… aaaaaarrrgggh !

    /* anciens  domaine  nouveaux      ||  Action
     * oui      non      non (obligé)  ||  = Reste
     * oui      oui      oui           ||  = Reste
     * oui      oui      non           ||  - Supprime
     * non      oui      oui           ||  + Ajoute
     * non      oui      non           ||  0 Aucune
     */
    
    var fusion = [];
    var iD = 0;
    var iN = 0;
    var iA = 0;
    var lA = anciens.length;
    var lD = domaine.length;
    var lN = nouveaux.length;
    while ((iA < lA) || (iD < lD) || (iN < lN)) {
        var uidA = (iA < lA) ? anciens[iA].modèle.objet.uid : Infinity;
        var uidD = (iD < lD) ? domaine[iD].uid              : Infinity;
        var uidN = (iN < lN) ? nouveaux[iN].objet.uid       : Infinity;
        
        var a = (iA < lA && uidA <= uidD);
        var d = (iD < lD && uidA >= uidD);
        var n = (iN < lN && uidD == uidN) && d;

        //console.log([iA,iD,iN], [uidA,uidD,uidN], [a,d,n]);
        
        if (a  && !(d && !n)) { // Reste
            if (n) {
                anciens[iA].setModèle(nouveaux[iN]);
            }
            fusion.push(anciens[iA]);
        }
        if (a  && d  && !n) {  // Supprime
            anciens[iA].suppression(animSuppression);
        }
        if (!a && d  && n) {   // Ajoute
            var cr = new CRésultatRecherche(nouveaux[iN], vRechercheParente);
            if (animAjout) {
                cr.vue.animAjout();
            }
            fusion.push(cr);
        }

        if (a) iA++;
        if (d) iD++;
        if (n) iN++;
    }
    return fusion;
}
