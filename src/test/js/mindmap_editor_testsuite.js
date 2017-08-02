var TestSuite = require("vertx-unit-js/test_suite");

var suite = TestSuite.create("the_test_suite");

suite = suite.before(function (context) {
  console.log("before enter");

  var async = context.async();
  vertx.deployVerticle("server/mindmap_editor.js", function(res, err) {
    if(err) {
      console.log("failed to deploy");
      context.fail("Deployment failed");
    } else {
      console.log("deployed " + res);
      context.put("mindmap_editor-ID", res);
      async.complete();
    }
  });

  console.log("before exit");
}).test("my_test_case", function (context) {
  console.log("my_test_case enter");

  var s = "value";
  context.assertEquals("value", s);

  //context.fail("That should never happen");

  console.log("my_test_case exit");
}).after(function (context) {
  console.log("after enter");

  var verticleId = context.get("mindmap_editor-ID");
  console.log("undeploying " + verticleId);
  vertx.undeploy(verticleId);

  console.log("after exit");
});

var completion = suite.run();

//completion.await();