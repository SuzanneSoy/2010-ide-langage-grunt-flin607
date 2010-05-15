function MRésultatRecherche() {
    $.extend(this, {
        objet: null,
        html: "",
        score: 0,
        position: null,
        mInstanceRecherche: null
    });
}

function VRésultatRecherche(vInstanceRechercheParente, position) {
    var vrr = $('#vue-résultat-recherche').jqote({}).toDom();
    vInstanceRechercheParente.ajoutVRésultatRecherche(vrr, position);
    $.extend(this,vrr);

    this.vTexte = this.find('.résultat-recherche.vTexte');
    this.vUid = this.find('.résultat-recherche.vUid');
    
    var that = this;
    this.animAjout = function() {
        that.addClass("ajout")
            .delay(2000)
            .queue(function(next){
                that.removeClass("ajout", 1000);
                next();
            });
    };
    
    this.animSuppression = function() {
        that.addClass("suppression", 500)
            .height(that.height) // hauteur fixée
            .animate({height: 0, opacity: 0}, 500, function() {
                that.suppression(false);
            });
    };
    
    this.suppression = function(anim) {
        if (anim) { return this.animSuppression(); }
        this.remove();
    }
}

function CRésultatRecherche(mRésultatRecherche, vInstanceRechercheParente) {
    this.vue = new VRésultatRecherche(vInstanceRechercheParente, mRésultatRecherche.position);
    this.setModèle = function(mRésultatRecherche) {
        this.modèle = mRésultatRecherche;
        this.vue.vTexte.html(this.modèle.html);
        this.vue.vUid.text(this.modèle.uid);
    }
    
    var that = this;
    this.vue.toggle(function() {
        that.modèle.mInstanceRecherche.ajouterRésultatSélection(that);
    }, function() {
        that.modèle.mInstanceRecherche.supprimerRésultatSélection(that);
    });
    
    this.ajoutSélection = function() {
        this.vue.addClass('sélectionné');
    };
    
    this.suppressionSélection = function() {
        this.vue.removeClass('sélectionné');
    };
    
    this.suppression = function(anim) {
        that.modèle.mInstanceRecherche.supprimerRésultatSélection(that);
        that.vue.suppression(anim);
    }
    
    this.setModèle(mRésultatRecherche);
}