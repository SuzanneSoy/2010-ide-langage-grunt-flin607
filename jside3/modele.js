function monde(nom) {
    $.extend(this, {
        // Propriétés
        nom: nom,
        // vue
        vues: [],
        // Parents
        // Enfants
        blocs: []
    });
}

function bloc(nom, monde) {
    $.extend(this, {
        // Propriétés
        nom: nom
        description: '',
        // vue
        vues: [],
        instances: [],
        // Parents
        monde: mondeParent,
        // Enfants
        definitions: [],
        portsEntree: [],
        portsSortie: []
    });
}

function instanceBloc(bloc, instanceBlocParente) {
    $.extend(this, {
        // Propriétés
        bloc: bloc,
        // vue
        vues: [],
        // Parents
        instanceBloc: instanceBlocParente
        // Enfants
        instancesPorts: []
    });
}

function definition(nom, blocParent) {
    $.extend(this, {
        // Propriétés
        nom: nom,
        description: '',
        // vue
        vues: [],
        // Parents
        bloc: blocParent,
        // Enfants
        liens: []
    });
}

function lien(de, vers, definitionParente) {
    $.extend(this, {
        // Propriétés
        de: de,
        vers: vers,
        // vue
        vues: [],
        // Parents
        definition: definitionParente
        // Enfants
    });
}

function port(blocParent) {
    $.extend(this, {
        // Propriétés
        nom: '',
        description: '',
        // vue
        vues: [],
        instances: [],
        // Parents
        bloc: blocParent,
        // Enfants
        liens: []
    });
}

function instancePort(port, instanceBlocParente) {
    $.extend(this, {
        // Propriétés
        port: port,
        // vue
        vues: [],
        // Parents
        instanceBloc: instabceBlocParente,
        // Enfants
        liens: []
    });
}