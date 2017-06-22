var TestSuite = require("vertx-unit-js/test_suite");

var suite = TestSuite.create("the_test_suite");

//console.log("I'm here!");

suite.test("my_test_case", function (context) {
  var s = "value";
  context.assertEquals("value", s);
//  console.log("Test case evaluated");
});

suite.run();