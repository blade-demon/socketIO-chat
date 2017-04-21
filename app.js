var http = require("http");
var express = require("express");
var path = require("path");
var logger = require("morgan");
var bodyParser = require("body-parser");
var {generateMessage, generateLocationMessage} = require("./utils/message");
var {Users} = require('./utils/users');
var {isRealString} = require('./utils/validation');
var routes = require("./routes/index");
var app = express();

app.set("views", path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'build')));

app.use('/', routes);

var server = http.createServer(app);
var io = require("socket.io").listen(server);
var users = new Users();
io.on('connection', (socket) => {
  //console.log('New user connected');
  // From Admin,
  // socket.emit('newMessage', generateMessage('Admin', "Welcome to the chat app"));
  //
  // socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));

  socket.on('join', (params, callback) => {
    if(!isRealString(params.name)|| !isRealString(params.room)) {
      callback('Name and room are required!');
    }

    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit('updateUserList', users.getUserList(params.room));
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));
    callback();
  });

  socket.on('createMessage', (message, callback) => {
    console.log("createMessage", message);
    io.emit('newMessage', generateMessage(message.from, message.text));
    //socket.broadcast.emit('newMessage', generatorMessage(message.from, message.text));
    callback();
  });

  socket.on('createLocationMessage', (coords) => {
    io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
  });

  socket.on('disconnect', () => {
    var user = users.removeUser(socket.id);
    if(user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
    }
  });
});

app.set('port', process.env.PORT || 3000);

server.listen(app.get('port'), () => {
  console.log('Express server listening on port: ' + app.get('port'));
});
