(function ( $ ) {
  var methods = {
    // $([1,2,3]).collect(function() { return this * this }) // => [1, 4, 9]
    collect: function(enumerable, callback) {
      var result = [];
      $.each(enumerable, function(index) {
        result.push(callback.call(this, index));
      });
      return $(result);
    },

    // Added by jspam@free.fr
    // $('.selector').invoke('height') // => [150, 25, 63]
    invoke: function (enumerable, method) {
      var result = [];
      var args = [];
      for (i = 2; i < arguments.length; i++) {
        args.push(arguments[i]);
      }
      $.each(enumerable, function(index) {
        var dollmeth = $(this)[method];
        if (dollmeth === undefined)
          result.push(this[method].apply(this, args));
        else
          result.push(dollmeth.apply($(this), args));
      });
        return $(result);
    },

    // $([1,2,3]).inject(0, function(a) { return a + this }) // => 6
    inject: function(enumerable, initialValue, callback) {
      var accumulator = initialValue;

      $.each(enumerable, function (index) {
        accumulator = callback.call(this, accumulator, index);
      });
      return accumulator;
    },

    // $([1,2,3]).select(function() { return this % 2 == 1 }) // => [1, 3]
    /* Removed by jspam@free.fr : conflicts with $.select() (for input forms)
      select: function(enumerable, callback) {
      var result = [];
      $.each(enumerable, function(index) {
        if (callback.call(this, index))
          result.push(this);
      });
      return $(result);
    }, */

    // $([1,2,3]).reject(function() { return this % 2 == 1 }) // => [2]
    reject: function(enumerable, callback) {
      return /*$.select*/$.filter(enumerable, negate(callback));
    },

    // $([1,2]).any(function() { return this == 1 }) // => true
    any: function(enumerable, callback) {
      return $.inject(enumerable, false, function(accumulator, index) {
        return accumulator || callback.call(this, index);
      });
    },

    // $([1,1]).any(function() { return this == 1 }) // => true
    all: function(enumerable, callback) {
      return $.inject(enumerable, true, function(accumulator, index) {
        return accumulator && callback.call(this, index);
      });
    },

    // $([1,2,3]).sum() // => 6
    sum: function(enumerable) {
      return $.inject(enumerable, 0, function(accumulator) {
        return accumulator + this;
      });
    }
  };

  var staticFunctions = {};
  var iteratorFunctions = {};
  $.each( methods, function(name, f){ 
    staticFunctions[name]   = makeStaticFunction(f);
    iteratorFunctions[name] = makeIteratorFunction(staticFunctions[name]);
  });
  $.extend(staticFunctions);
  $.fn.extend(iteratorFunctions);

  // Private methods
  function makeStaticFunction(f) {
    return f; /* function() {
      if (arguments.length > 1) // The first argument is the enumerable
        validateCallback(arguments[arguments.length - 1]);

      return f.apply(this, arguments);
    } */
  }

  function makeIteratorFunction(staticFunction) {
    return function() {
      // arguments isn't a real array, concat doesn't work
      // unless you explicitly convert it
      function toArray() {
        var result = []
        for (var i = 0; i < this.length; i++)
          result.push(this[i])
        return(result)
      }
      return staticFunction.apply(this, [this].concat(toArray.apply(arguments)))
    }
  }

  function validateCallback(callback) {
    if (!jQuery.isFunction(callback))
      throw("callback needs to be a function, it was: " + callback);
  }

  function negate(f) {
    return function() { 
      return !f.apply(this, arguments)
    }
  }
})( jQuery );
