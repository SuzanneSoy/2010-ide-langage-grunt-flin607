function makeView(obj, type, emplacement) {
    obj.vue = $('#vues > .' + type).clone().appendTo(emplacement);
    
    //Debug
    if (obj.vue.size() == 0) {
        console.log("Warning! Couldn't append template #vues > ." + type + " to", emplacement);
    }
    
    var parties =  $.makeArray(arguments);
    obj.parties = {};
    for (var i = 3; i < parties.length; i++) {
        obj.parties[parties[i]] = obj.vue.find('.' + parties[i]);
        
        // Debug
        if (obj.parties[parties[i]].size() == 0) {
            console.log("Warning! Couldn't find part", i, parties[i], "for", type, obj, ". obj is in debugPart.");
            debugPart = obj;
        }
    }
}
