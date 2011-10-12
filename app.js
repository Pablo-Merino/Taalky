var app = require('express').createServer();
var io = require('socket.io').listen(app);

app.listen(8888);

// routing
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});
app.get('/m', function (req, res) {
  res.sendfile(__dirname + '/mobile.html');
});
app.get('/script.js', function (req, res) {
  res.sendfile(__dirname + '/script.js');
});
app.get('/mobile.js', function (req, res) {
  res.sendfile(__dirname + '/mobile.js');
});
app.get('/m.style.css', function (req, res) {
  res.sendfile(__dirname + '/m.style.css');
});
app.get("/about", function(req, res) {
      res.sendfile(__dirname + '/index.html');

});
app.get("/error", function(req, res) {
    res.writeHead(500);
    res.end('<title>Taalki auth error</title>\n<!--taalki failed:(-->\n<h1 align="center">Login/auth error</h1>');

});
// usernames which are currently connected to the chat
var usernames = {};


io.sockets.on('connection', function (socket) {

  // when the client emits 'sendchat', this listens and executes
  socket.on('sendchat', function (data) {
    // we tell the client to execute 'updatechat' with 2 parameters
    io.sockets.emit('updatechat', socket.username, data, {notice:0});
  });
  socket.on('sendnotice', function (data) {
    // we tell the client to execute 'updatechat' with 2 parameters
    io.sockets.emit('updatechat', socket.username, data, {notice:1});
  });
  // when the client emits 'adduser', this listens and executes
  socket.on('adduser', function(username, id){
    // we store the username in the socket session for this client
    socket.username = username;
    // add the client's username to the global list
    usernames[username]=id;
    // echo to client they've connected
    socket.emit('updatechat', 'SERVER', 'you have connected',{notice:1});
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('updatechat', 'SERVER', username + ' has connected',{notice:1});
    // update the list of users in chat, client-side
    io.sockets.emit('updateusers', usernames);
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function(){
    // remove the username from global usernames list
    delete usernames[socket.username];
    // update list of users in chat, client-side
    io.sockets.emit('updateusers', usernames);
    // echo globally that this client has left
    socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected',{notice:1});
  });
});