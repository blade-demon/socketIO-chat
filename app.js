var http = require("http");
var express = require("express");
var path = require("path");
var logger = require("morgan");
var bodyParser = require("body-parser");
var {generateMessage, generateLocationMessage} = require("./utils/message");
var {isRealString} = require('./utils/validation');
var routes = require("./routes/index");
var app = express();

app.set("views", path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

var server = http.createServer(app);
var io = require("socket.io").listen(server);

io.sockets.on('connection', (socket) => {
  console.log("new user connected");

  // From Admin,
  socket.emit('newMessage', generateMessage('Admin', "Welcome to the chat app"));

  socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));

  socket.on('join', (params, callback) => {
    if(!isRealString(params.name)|| !isRealString(params.room)) {
      callback('name and room are required!');
    }
    callback();
  });

  socket.on('createMessage', (message, callback) => {
    console.log("createMessage", message);
    io.emit('newMessage', generateMessage(message.from, message.text));
    //socket.broadcast.emit('newMessage', generatorMessage(message.from, message.text));
    callback("This is from server.");
  });

  socket.on('createLocationMessage', (coords) => {
    io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
  });

  socket.on('disconnect', () => {
    console.log('User was disconnected!');
  });
});

app.set('port', process.env.PORT || 3000);
server.listen(app.get('port'), () => {
  console.log('Express server listening on port: ' + app.get('port'));
});
