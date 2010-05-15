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
    /* Mathias Bynens - http://stackoverflow.com/questions/2059743/detect-elements-overflow-using-jquery */
    overflows: function() {
        return ($(this).width() !== this.clientWidth || $(this).height() !== this.clientHeight);
    },
    scrollToLast: function(speed) {
        return this.scrollTo(this.children().last(), speed);
    },
    addTo: function(collection) {
        $.merge(collection, this);
        return collection;
    },
    remap: function(fn) {
        var a = $.makeArray(arguments);
        a.shift();

        var r = $();
        this.each(function(i, e) {
            var aa = $.makeArray(a);
            aa.push(e);
            r = r.add(fn.apply(this, aa));
        });
        return r;
    },
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
            var ret = $(this).map(function (i) {
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


getRectangle = function(x1,y1,x2,y2) {
    if (x2 === undefined) {
        var oa = $(x1).offset();
        var ob = $(y1).offset();
        return getRectangle(oa.left, oa.top, ob.left, ob.top);
    }
    return {
        x1: Math.min(x1,x2),
        y1: Math.min(y1,y2),
        x2: Math.max(x1,x2),
        y2: Math.max(y1,y2),
        width: Math.abs(x1 - x2),
        height: Math.abs(y1 - y2)
    };
};

jQuery.fn.corners = function(x1,y1,x2,y2) {
    var rect = getRectangle(x1,y1,x2,y2);
    this.offset({left: rect.x1, top: rect.y1});
    this.width(rect.width);
    this.height(rect.height);
}

jQuery.fn.zonable = function(start, zone, end) {
    var opts = {
        start: function() {return true;},
        zone: function() {return true;},
        end: function() {return true;}
    };
    if (typeof start == "function") {
        if (start) opts.start = start;
        if (zone) opts.start = start;
        if (end) opts.start = start;
    } else {
        if (start) $.extend(opts, start);
    }
    
    var z = {};
    z.vZone = $('#vue-zone').jqote({}).appendTo(this);
    z.vZone.hide();
    z.zoning = false;
    z.start = null;

    z.manageDown = function(e) {
        if (e.target != this || opts.start(e) === false) {
            return true;
        }
        z.start = $(e);
        z.zoning = true;
        z.vZone.show();
        z.manageMove(e);
        return false;
    };
    z.manageMove = function(e) {
        if (z.zoning) {
            if (opts.zone(z.start, e) === false) {
                return true;
            }
            z.vZone.corners(z.start, e);
            return false;
        }
    };
    z.manageUp = function(e) {
        if (z.zoning) {
            z.manageMove(e);
            if (opts.end(z.start, e, getRectangle(z.start, e)) === false) {
                return true;
            }
            z.vZone.hide();
            z.zoning = false;
            return false;
        }
    }
    
    var that = this;
    this.mousedown(z.manageDown);
    this.mousemove(z.manageMove);
    this.mouseup(z.manageUp);
}


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
