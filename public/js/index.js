var socket = io();

socket.on('connect', function () {
  console.log('Connected to server...');
});

socket.on('disconnect', () => {
  console.log('Disconnected to server.');
});

socket.on('newMessage', (message) => {
  var formmatedTime = moment(message.createdAt).format('h:mm a');
  var template = jQuery('#message-template').html();
  var html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formmatedTime
  });

  jQuery('#messages').append(html);
});

jQuery('#message-form').on('submit', function (e) {
  e.preventDefault();
  socket.emit('createMessage', {
    from: 'User',
    text: jQuery('[name=message]').val()
  }, function () {

  });
});

socket.on('newLocationMessage', (message) => {
  var formmatedTime = moment(message.createdAt).format('h:mm a');
  var template = jQuery('#locationmessage-template').html();
  var html = Mustache.render(template, {
    url: message.url,
    from: message.from,
    createdAt: formmatedTime
  });
  jQuery('#messages').append(html);
});


var locationButton = jQuery('#send-location');
locationButton.on('click', function () {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported on your browser.');
  }
  navigator.geolocation.getCurrentPosition(function (position) {
    console.log("position: " + position);
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function (error) {
    alert('Unable to fetch location');
  });

});