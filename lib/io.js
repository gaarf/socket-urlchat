var RoomManager = require('./manager.js'),
    User = require('./user.js'),
    _ = require('underscore');

module.exports = function(server) {

  var io = require('socket.io').listen(server),
      chat = io.of('/chat'),
      manager = new RoomManager();

  io.set('log level', 1); // reduce logging

  chat.on('connection', function (socket) {

    var room = null,
        user = new User(socket.id),
        onRoster = function() { socket.emit('roster', room.roster); },
        onConvo = _.bind(socket.emit, socket, 'conversation'),
        onTick = _.bind(socket.emit, socket, 'tick');

    manager.on('tick', onTick);

    socket.on('hello', function (data) {
      room = manager.get(data.room);

      room.on('roster', onRoster);
      room.on('conversation', onConvo);

      user.processMessage({hello: data});
      user.joinRoom(room);

      if(room.buffer.length) {
        socket.emit('history', room.buffer);        
      }
    });

    socket.on('speech', function (speech) {
      var o = {compo:speech};
      if(speech.charAt(0)==='/') {
        o = {slash: speech.substr(1).split(' ')};
      }
      user.processMessage(o);
    });

    user.on('slash-response', _.bind(socket.emit, socket, 'slash'));

    user.on('name-update', function() { socket.emit('name-update', this.name); } );

    socket.on('disconnect', function (socket) {
      room.removeListener('roster', onRoster);
      room.removeListener('conversation', onConvo);
      manager.removeListener('tick', onTick);
      user.partRoom();
      user.removeAllListeners();
      delete user;
    });

  });

};
