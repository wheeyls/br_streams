// Basic streams
// Inspired by http://blog.vjeux.com/2011/javascript/stream-lazy-iteration-with-continuation.html
(function(context) {
  var clone, br_stream, generator;
  clone = function(obj) {
    var F = function() {};
    F.prototype = obj;
    return new F;
  };
  generator = {
    next: null,
    make: function() {
      return clone(this);
    },
    stop: function() {
      throw new generator.Stopper;
    },
    delay: 0,
    async: true,
    to_stream: function(gen) {
      gen = gen || this;
      return br_stream.make(function stream(next) {
        try {
          next(gen.next());
          
          if(this.async) {
            window.setTimeout(function() {
              stream(next);
            }, this.delay);
          } else {                 
            stream(next);
          }
        } catch(e) {
          if(!(e instanceof generator.Stopper)) {
            throw e;
          }
        }
      });
    },
    Stopper: function() {}
  };
  br_stream = {
    empty: function empty() { },
    cons: function(head, tail) {
      return this.make(function(next) {
        next(head);
        tail(next);
      });
    },
    extend: function(orig, values) {
      for(var i in values) {
        if(values.hasOwnProperty(i))
          console.log(i);
      }
    },
    stream: null,
    make: function(stream) {
      var f = clone(this);
      
      // override a property
      f.stream = stream || this.empty;
      return f;
    }, 
    range: function(min, max) {
      var me = generator.make(), 
        i = min || 0;
      
      me.next = function() {
        if(typeof max === "number" && i > max) {
          me.stop();
        }
        return i++;
      };
      
      return me.to_stream();
    },
    filter: function(f, stream) {
      stream = stream || this.stream;
      return this.make(function(next) {
        stream(function(val) {
          if(f(val)) {
            next(val);
          }
        })
      });
    },
    map: function(f, stream) {
      stream = stream || this.stream;
      return this.make(function(next) {
        stream(function(val) {
          next(f(val));
        });
      });
    },
    reduce: function(f, initial, stream) {
      var ret = initial;
      stream = stream || this.stream;
      stream(function(val){
        ret = f(val, ret);
      });
      return ret;
    },
    toArray: function(stream) {
      var arr = [];
      stream = stream || this.stream;
      
      stream(function(val){ 
        arr.push(val);
      });
      
      return arr;
    },
    print: function(stream) {
      stream = stream || this.stream;
      
      stream(function(val){ 
        console.log(val)
      });
    }
  };
  
  context.br_stream = br_stream;
  context.generator = generator;
}(this));
