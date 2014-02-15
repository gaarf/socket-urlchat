jQuery(function(){

  var socket = io.connect('http://localhost/chat');

  socket.on('connect', function () { 

    console.log('connected, emitting hello...');
    socket.emit('hello', { 
      room: location.pathname.replace(/^\/room/, '')
    , ua: navigator.userAgent
    });

  });


  socket.on('tick', function (data) { 
    $('#stats').text(JSON.stringify(data));
  });


  socket.on('roster', function (roster) { 
    console.log('roster', roster);
  });

  socket.on('slash', function () { 
    console.log('slash', arguments);
  });

  socket.on('conversation', function () { 
    console.log('conversation', arguments);
  });

});