singleton = (function() {
    var s = { uid: 0 };
    return {
        uid: function () {
            return s.uid++;
        },
        portClickA: {},
        portClickB: null
    };
})();

function makeUid(obj) {
    obj.uid = singleton.uid();
}