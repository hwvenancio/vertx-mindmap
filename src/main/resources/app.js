var Router = require("vertx-web-js/router");
var StaticHandler = require("vertx-web-js/static_handler");
var SockJSHandler = require("vertx-web-js/sock_js_handler");

var options = {
    "inboundPermitteds" : [
        {"address" : 'mindMaps.list' }
        , {"address" : 'mindMaps.list' }
        , {"address" : 'mindMaps.save' }
        , {"address" : 'mindMaps.delete' }
        , {"addressRegex": 'mindMaps\\.editor\\..+' }
    ]
    , "outboundPermitteds": [
        { "addressRegex": 'mindMaps\\.events\\..+' }
    ]
};

var router = Router.router(vertx);

var sockJSHandler = SockJSHandler.create(vertx);
sockJSHandler.bridge(options);
router.route("/eventbus/*").handler(sockJSHandler.handle);

var staticHandler = StaticHandler.create();
router.route("/*").handler(staticHandler.handle);

var server = vertx.createHttpServer();
//var port = config().getInteger("http.port", 8080);
var port = Vertx.currentContext().config().port | 8080;
server.requestHandler(router.accept).listen(port);

vertx.deployVerticle('server/mindmaps.js');
vertx.deployVerticle('server/mindmap_editor.js');
