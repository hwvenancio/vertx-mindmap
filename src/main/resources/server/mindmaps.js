var MongoClient = require("vertx-mongo-js/mongo_client");

var eventBus = vertx.eventBus();

var config = {
    "db_name": "mindMaps"
    , "connection_string": "mongodb://mongo:27017"
};

var mongoClient = MongoClient.createShared(vertx, config);

eventBus.consumer('mindMaps.list', function(message) {
    mongoClient.find("mindMaps", {}, function (res, res_err) {
        if (res_err == null) {
            var body = {mindMaps: res};
            message.reply(body);
        } else {
            console.log(res_err);
        }
    });
});

eventBus.consumer('mindMaps.find', function(message) {
    var args = message.body();
    mongoClient.find("mindMaps", {_id: args._id}, function(res, res_err) {
        if (res_err == null) {
            var body = {mindMap: res[0]};
            message.reply(body);
        } else {
            console.log(res_err);
        }
    });
});

eventBus.consumer('mindMaps.save', function(message) {
    var mindMap = message.body();
    mongoClient.save("mindMaps", mindMap, function(res, res_err) {
        if (res_err == null) {
            if(res != null)
                mindMap._id = res;
            var body = mindMap;
            message.reply(body);
        } else {
            console.log(res_err);
        }
    });
});

eventBus.consumer('mindMaps.delete', function(message) {
    var args = message.body();
    mongoClient.remove("mindMaps", {_id: args.id}, function(res, res_err) {
        if (res_err == null) {
            var body = {};
            message.reply(body);
        } else {
            console.log(res_err);
        }
    });
});
