var eventBus = vertx.eventBus();
var mindMapUtils = require('../webroot/mindmap_utils');

function newNodeKey() {
  return java.util.UUID.randomUUID().toString();
}

function publishMindMapEvent(mindMap, event) {
    eventBus.publish('mindMaps.events.'+mindMap._id, event);
}

eventBus.consumer('mindMaps.editor.addNode', function(message) {
    var args = message.body();
    eventBus.send('mindMaps.find', {_id: args.mindMapId}, function(ar, ar_err) {
        if(ar_err == null) {
            var res = ar.body();
  	        if (res.mindMap) {
	            var mindMap = res.mindMap;
	            var parent  = mindMapUtils.findNodeByKey(mindMap, args.parentKey);
	            var newNode = {key: newNodeKey()};
	            if (args.name) {
		            newNode.name = args.name;
	            } else {
		            newNode.name = 'Click to edit';
  	            }

                if (!parent.children) {
		            parent.children = [];
	            }
	            parent.children.push(newNode);

	            eventBus.send('mindMaps.save', mindMap, function(ar, ar_err) {
                    if(ar_err == null) {
	                    publishMindMapEvent(mindMap, {event: 'nodeAdded', parentKey: args.parentKey, node: newNode});
	                } else {
	                    console.log('error');
	                }
	            });
            }
        }
    });
});

eventBus.consumer('mindMaps.editor.renameNode', function(message) {
    var args = message.body();
    eventBus.send('mindMaps.find', {_id: args.mindMapId}, function(ar, ar_err) {
        if(ar_err == null) {
            var res = ar.body();
            if (res.mindMap) {
                var mindMap = res.mindMap;
                var node    = mindMapUtils.findNodeByKey(mindMap, args.key);

                if (node) {
      	            node.name = args.newName;
      	            eventBus.send('mindMaps.save', mindMap, function(ar, ar_err) {
      	                if(ar_err == null) {
                            publishMindMapEvent(mindMap, {event: 'nodeRenamed', key: args.key, newName: args.newName});
                        } else {
                            console.log('error');
                        }
      	            });
                }
            }
        }
    });
});

eventBus.consumer('mindMaps.editor.deleteNode', function(message) {
    var args = message.body();
    eventBus.send('mindMaps.find', {_id: args.mindMapId}, function(ar, ar_err) {
        if(ar_err == null) {
            var res = ar.body();
            if (res.mindMap) {
                var mindMap = res.mindMap;
                var parent  = mindMapUtils.findNodeByKey(mindMap, args.parentKey);

                parent.children.forEach(function(child, index) {
                    if (child.key === args.key) {
                        parent.children.splice(index, 1);
                        eventBus.send('mindMaps.save', mindMap, function(ar, ar_err) {
                            if(ar_err == null) {
                                publishMindMapEvent(mindMap, {event: 'nodeDeleted', parentKey: args.parentKey, key: args.key});
                            } else {
                                console.log('error');
                            }
                        });
                    }
                });
            }
        }
    });
});
