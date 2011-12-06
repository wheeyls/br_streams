$(document).ready(function() {
  module("br_stream", {
    setup: function(){},
    teardown: function(){}
  });
  test("should be able to clone the stream object with a new stream", function() {
    var s = br_stream.make(function() {
      return function(next) {
        for(var i=0, ii=3; i<ii; i++) {
          next(i);
        }
      }
    }),
    result = s.join(",");
    
    equals(result, "1,2,3");
  });
  test("can join elements of a stream into a string", function() {
    var s = br_stream.make(function() {
      return function(next) {
        for(var i=0, ii=3; i<ii; i++) {
          next(i);
        }
      }
    }),
    result = s.join(",");
    
    equals(result, "1,2,3");
  });
  test("should be able to filter a stream", function() {
    var s = br_stream.make(function() {
      return function(next) {
        for(var i=0, ii=3; i<ii; i++) {
          next(i);
        }
      }
    }),
    result = s.join(",");
    
    equals(result, "1,2,3");
  });
  test("should be able to call map to modify a stream", function() {
    var s = br_stream.make(function() {
      return function(next) {
        for(var i=0, ii=3; i<ii; i++) {
          next(i);
        }
      }
    }),
    result = s.join(",");
    
    equals(result, "1,2,3");
  });
});