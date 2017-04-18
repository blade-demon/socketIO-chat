var socket = io();

function  scrollToBottom() {
  // Selectors
  var messages = jQuery('#messages');
  var newMessage = messages.children('li:last-child');
  // Heights
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();
  if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
}

socket.on('connect', function () {
  var params = jQuery.deparam(window.location.search);
  socket.emit('join', params, function (err) {
    if(err) {
      alert(err);
      window.location.href='/';
    } else {
      console.log('No error');
    }
  });
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
  scrollToBottom();
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
  scrollToBottom();
});


var locationButton = jQuery('#send-location');
locationButton.on('click', function () {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported on your browser.');
  }
  navigator.geolocation.getCurrentPosition(function (position) {
    //console.log("position: " + position);
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function (error) {
    alert('Unable to fetch location');
  });

});