$(document).ready(function() {
  module("br_stream", {
    setup: function(){},
    teardown: function(){}
  });
  test("should be able to clone the stream object with a new stream", function() {
    var f = function() {
      return function() {};
    }, 
    s = br_stream.make(f);
    
    equals(f, s.stream, "Instance has the stream");
    notEqual(f, br_stream.stream, "Superclass has it's own stream");
    notEqual(s, br_stream, "Instance is not it's parent");
    equal(s.toArray, br_stream.toArray, "parent functions untouched");
  });
  test("can call toArray on a stream", function() {
    var s = br_stream.make(function(next) {
        for(var i=1, ii=3; i<=ii; i++) {
          next(i);
        }
      }),
    result = s.toArray();
    
    same(result, [1,2,3], "returns an array");
  });
  test("can create an infinite range", function() {
    stop();
    var s = br_stream.range(1,3),
      res = [],
      exp = [1,2,3];
      
    s.stream(function(val) {
      res.push(val);
      if(res.length === 3) {
        start();
        same(res, [1,2,3]);
      }
    }); 
  });
  test("should be able to filter a stream", function() {
    var s = br_stream.make(function(next) {
        for(var i=1, ii=3; i<=ii; i++) {
          next(i);
        }
      }),
    result = s.filter(function(val) {
      return val % 3 === 0;
    }),
    arr = result.toArray();

    equals(result.toArray, br_stream.toArray, "returns a new stream object");
    same(arr, [3]);
  });
  test("should be able to call map to modify a stream", function() {
    var s = br_stream.make(function(next) {
      for(var i=1, ii=3; i<=ii; i++) {
        next(i);
      }
    }),
    mapped = s.map(function(i) {
      return i*3;
    }),
    result = mapped.toArray().join(",");
    
    equals(result, "3,6,9");
  });
  test("can reduce the stream", function() {
    var s = br_stream.make(function(next) {
      [1,2,3].forEach(function(v) {
        next(v);
      });
    }),
    result = s.reduce(function(a, b) {
      return a+b;
    }, 0);

    equals(result, 6, "added up number");
  });
  test("can create a stream from a generator", function() {
    var ticks = function(time) {
      var me = generator.make(),
        starting = new Date();
      
      me.next = function() {
        var now = new Date();
        if(now-starting >= time) {
          me.stop();
        }
        return now;
      };
      
      return me.to_stream();
    }, t = ticks(2000);
    equals(t.toArray, br_stream.toArray, "returns a stream object");
  });
  test("can create a functional list", function() {
    var list = s.range(1,3).to_list();
    
    
  });
});
