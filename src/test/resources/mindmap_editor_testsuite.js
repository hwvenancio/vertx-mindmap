var TestSuite = require("vertx-unit-js/test_suite");

var suite = TestSuite.create("the_test_suite");

suite.before(function (context) {
  console.log("before enter");

  var async = context.async();
  vertx.deployVerticle("server/mindmap_editor.js", function(res, err) {
    if(err) {
      context.fail("Deployment failed");
    } else {
      context.put("mindmap_editor-ID", res);
      async.complete();
    }
  });

  console.log("beforeEach exit");
});

suite.after(function (context) {
  console.log("after enter");

  console.log("after exit");
});

suite.test("my_test_case", function (context) {
  var s = "value";
  context.assertEquals("value", s);
});

suite.run();