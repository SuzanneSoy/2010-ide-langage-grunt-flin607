/* function MQuelqueChose() */
/* function VQuelqueChose(vueParente) */
/* function CQuelqueChose(modèle, vueParente) */

/*
Règles :
Le modèle ne fait que des callbacks.
La vue ne peut que s'ajouter à sa vue parente.
Le contrôleur peut dialoguer avec son modèle, sa vue, et les enfants de sa vue.
Le contrôleur peut transmettre la vue parente reçue en paramètre à sa vue.
*/

function test() {
    var mMonde = new MMonde("Le Monde");
    var cMonde = new CMonde(mMonde, '#editeur');
    
/*    var b = new Bloc("Bloc 1");
    m.ajouterBloc(b);
    
    var ib = new InstanceBloc(b, m.scratch);
    b.ajouterInstance(ib);
    
    new VInstanceBloc(null, ib); // TODO
    */
    testlog(mMonde, 6);
}

$(function(){ test(); });
