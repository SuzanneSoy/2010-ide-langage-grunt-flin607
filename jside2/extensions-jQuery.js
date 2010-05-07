// Extensions de String

String.prototype.escapeXML = function() {
    return this
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/* "<div>foo</div>".toDom() ⇔ $("<div>foo</div>") */
String.prototype.toDom = function() {
    return $("" + this);
}

String.prototype.appendTo = function() {
    var d = this.toDom();
    return d.appendTo.apply(d, arguments);
}

// Extensions de jQuery

jQuery.fn.extend({
    // Sérialise le DOM de l'élément sous forme de HTML.
    serializeDOM: function(value) {
        /* get the DOM of this node, serialized as HTML.
         * with value, set the DOM of this node to the
         * serialized HTML value (Not Implemented Yet) */
        if ( value === undefined ) {
	    return this.html().escapeXML();
	}
    },
    // renvoie le map de attr sur chaque élément (lecture seule).
    attrs: function(value) {
        return this.map(function(idx, elem) {
            return $([elem]).attr(value);
        });
    },
    // Active ou désactive resizable(), et rend la hauteur libre.
    toggleResizable: function() {
        // TODO : devrait enregistrer les options.
        
        if (this.data('notResizable')) {
            this.resizable();
            this.height(this.data('oldHeight'));
        } else {
            this.resizable('destroy');
            this.data('oldHeight', this.height());
            this.height('auto');
        }
        
        this.data('notResizable', ! this.data('notResizable'))
        
        return this;
    },
    
    // Alias pour des accesseurs courants sur les positions des éléments
    // Top, left, center, bottom, right, en X et en Y.
    offX: function(value) {
        if (value === undefined) {
            return this.offset().left;
        } else {
            return this.offset({left: value});
        }
    },
    offY: function(value) {
        if (value === undefined) {
            return this.offset().top;
        } else {
            return this.offset({top: value});
        }
    },
    leftX: function() {
        return this.offX.apply(this, arguments);
    },
    topY: function() {
        return this.offY.apply(this, arguments);
    },
    centerX: function() {
        return this.offX() + (this.width() / 2);
    },
    centerY: function() {
        return this.offY() + (this.height() / 2);
    },
    rightX: function() {
        return this.offX() + this.width();
    },
    bottomY: function() {
        return this.offY() + this.height();
    }
});

// Fonction utilitaire permettant de facilement surcharger un
// accesseur pour un certain type d'éléments.
function surchargeAccesseur(nom, type, get, set) {
    var _old = $.fn[nom];
    $.fn[nom] = function(options) {
        var args = arguments;
        if (options !== undefined) {
            var that = this;
            var ret = this.map(function (i) {
                if (that[i] instanceof type) {
                    return set(that[i], options);
                } else {
                    return _old.apply($(that[i]), args);
                }
            });
            return ret[0];
        } else {
            if (this[0] instanceof type) {
                return get(this);
            } else {
	        return _old.call(this);
            }
        }
    };
    
}

function surchargeAccesseurSimple(nom, defaut, type) {
    surchargeAccesseur(
        nom,
        type,
        function (obj) { ret = obj[0][nom]; return (ret !== undefined) ? ret : defaut; },
        function (obj, val) { obj[nom] = val; }
    );
}

// Permet d'utiliser un évènement comme si c'était un élément du DOM.

// This is the beauty of JavaScript ♥.
surchargeAccesseurSimple('height', 0, $.Event);
surchargeAccesseurSimple('width', 0, $.Event);
surchargeAccesseurSimple('scrollLeft', 0, $.Event);
surchargeAccesseurSimple('scrollTop', 0, $.Event);
surchargeAccesseurSimple('outerWidth', 0, $.Event);
surchargeAccesseurSimple('outerHeight', 0, $.Event);
surchargeAccesseur(
    'offset',
    $.Event,
    function (obj) {
        return {
            left: obj[0].pageX,
            top:  obj[0].pageY
        };
    },
    function (obj, val) {
        if ('left' in val) { that[i].pageX = val.left; }
        if ('top'  in val) { that[i].pageY = val.top;  }
    }
);

// Fix firefox bug : when top or left are set to a non-integer value, flicker occurs. 
(function ($) {
    var _offset = $.fn.offset;
    
    $.fn.offset = function(options) {
        var args = arguments;
        if (options !== undefined) {
            if ('left' in options) { args[0].left = Math.floor(options.left); }
            if ('top'  in options) { args[0].top  = Math.floor(options.top);  }
        }
        
        return _offset.apply(this, args);
    }
}(jQuery));



/* Fioritures graphique */
jQuery.fn.extend({
    blink: function (count, speed) {
        elem = this;
        count = count || 10;
        speed = speed || 1000;
        
        // Mouseover
        // Todo : il y a des bugs graphiques ici,
        // et il faudrait enlever ce hook "mouseover"
        // après la première fois.
        elem.mouseover(function () {
            elem.clearQueue("blink");
            elem.queue("blink", function() {
                elem.removeClass('boutonHover', 1000);
            });
        });
        
        // Enqueue blinks
        for (; count > 0; count--) {
            elem.queue("blink", function () {
                elem.toggleClass('boutonHover', 1000, function() { elem.dequeue("blink"); });
            });
        }
        elem.queue("blink", function() {
            elem.removeClass('boutonHover', 1000);
        });
        
        // Start first blink
        elem.dequeue("blink");
    }
});
