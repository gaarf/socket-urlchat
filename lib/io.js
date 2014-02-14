module.exports = function(server) {

  var io = require('socket.io').listen(server)
    , chat = io.of('/chat');

  chat.on('connection', function (socket) {

    console.log('user connected');
    socket.broadcast.emit('roster', 'plus!');

    socket.on('hello', function (data) {
      console.log(data);
    });

    socket.on('disconnect', function (socket) {

      console.log('user disconnected');
      chat.emit('roster', 'minus!');

    });

  });


  setInterval(function(){

    chat.emit('tick', Date.now());

  }, 3000);

};
