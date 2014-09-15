!function (glob) {

  var mutate = function (input, ctx) {
    var map = {};

    return {

      // add a new method
      method: function (sig, fn) {
        sig || (sig = []);
        map[sig.join('::').toLowerCase()] = {
          fn: fn,
          inject: fn.length > sig.length
        };

        return this;
      },

      // return the composed new function
      close: function () {
        return function () {
          var args = Array.prototype.slice.call(arguments, 0),
            sig = (function () {
              var ret = [];
              for (var i = 0, len = args.length; i < len; i++) {
                ret.push(toType(args[i]));
              }
              return ret;
            })().join('::');

          if (map[sig]) {
            if (map[sig].inject) args.unshift(input);
            return map[sig].fn.apply(ctx || map[sig].fn, args);
          }

          return input && input.apply(ctx || input, args);
        }
      }

    };

  };

  // http://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/
  var toType = function (obj) {
    return Object.prototype.toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
  };

  // Node.js / browserify
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = mutate;
  }
  // <script>
  else {
    glob.mutate = mutate;
  }

}(this);