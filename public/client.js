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
    var $roster = $('.roster').empty();
    $.each(roster, function() {
      $roster.append(
        $('<li>').text(this.name)
      );
    });
  });

  var $convo = $('.conversation')
    , $compose = $('form.compose')
    , $input = $compose.find('input');

  function appendMessage() {
    var d = new Date(this.time);
    $convo.append(
      $('<li>').append(
        $('<time>').text(d.toLocaleString()).attr('datetime', d.toISOString()),
        $('<q>').text(this.text).attr('cite',this.user.name)
      )
    );
  }

  socket.on('history', function (history) { 
    $convo.empty();
    if(history.length) {
      $convo.removeClass('empty');
      $.each(history, appendMessage);
    }
    else {
      $convo.addClass('empty');
    }
  });

  socket.on('conversation', function (conversation) { 
    appendMessage.call(conversation);
  });

  socket.on('slash', function (msg, cls) { 
    var $help = $('<div>').html(msg).addClass('flash '+cls);
    $help.insertAfter($compose);
    setTimeout(function(){ $help.fadeOut(); }, 5000);
  });


  $compose.submit(function(e){
    e.preventDefault();

    var val = $input.val()
      , valParts = val.split(' ');

    switch(valParts[0]) {
      case "/join":
        if(valParts[1].match(/^\w/)) {
          location.assign('/room/'+valParts[1]);
          break;
        }

      default:
        socket.emit('speech', val);
    }
    $input.val('');
  });

  $input.focus();
});
