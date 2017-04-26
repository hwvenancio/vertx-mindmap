var eb = new EventBus(window.location.protocol + '//' +
                            window.location.hostname + ':' +
                            window.location.port + '/eventbus');

eb.onopen = function() {

  var renderListItem = function(mindMap) {
    var li = $('<li>');

    var openMindMap = function(event) {
      new MindMapEditor(mindMap, eb);
      event.preventDefault();
      return false;
    };

    var deleteMindMap = function(event) {
      eb.send('mindMaps.delete', {id: mindMap._id}, function() {
        li.remove();
      });
      event.preventDefault();
      return false;
    };

    $('<a>').text(mindMap.name).attr('href', '#').on('click', openMindMap).appendTo(li);
    $('<button>').text('Delete').on('click', deleteMindMap).appendTo(li);

    li.appendTo('.mind-maps');
  };

  $('.create-form').submit(function(event) {
    var nameInput = $('[name=name]', this);
    eb.send('mindMaps.save', {name: nameInput.val()}, function(err, res) {
      renderListItem(res.body);
      nameInput.val('');
    });
    event.preventDefault();
    return false;
  });

  eb.send('mindMaps.list', {}, function(err, res) {
    if(res.body.mindMaps) {
      $.each(res.body.mindMaps, function() {
        renderListItem(this);
      });
    }
  })

};
