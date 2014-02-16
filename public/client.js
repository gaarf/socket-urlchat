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
    var totalUsers = 0
      , listMarkup = (function b(root, leaf) {
          var html = '';
          $.each(leaf, function(key) {
            var p = root + ( key==='_' ? '' : '/'+key );
            if(this instanceof Array) {
              totalUsers += this[0];
              html += '<li data-rostersize="'+this[0]+'" data-buffersize="'+this[1]+'">'
              html += '<a href="/room' + p + '">' + p +'</a></li>';
            }
            else {
              html += b(p, this);
            }
          });
          return html; 
        })('', data.tree);
    $('#stats')
      .empty()
      .append(
        '<p>'+ totalUsers +' users in '+ data.roomCount +' rooms</p>',
        '<ul>'+ listMarkup +'</ul>'
      );
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
        // intentional fall-through

      default:
        socket.emit('speech', val);
    }
    $input.val('');
  });

  $input.focus();
});
