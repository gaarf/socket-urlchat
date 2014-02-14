jQuery(function(){

  var socket = io.connect('http://localhost/chat');

  socket.on('connect', function () { 

    console.log('connected, emitting hello...', socket);
    socket.emit('hello', { room: URLCHAT.room, ua: navigator.userAgent });

  });


  socket.on('message', function (message) { 
    console.log('message', message);
  });


  socket.on('roster', function (roster) { 
    console.log('roster', roster);
  });


  socket.on('convo', function (convo) { 
    console.log('convo', convo);
  });

});