var _ = require('underscore');

module.exports.slash = slashCommand;
/* ================================================================ slashCommand */

function slashCommand(user, o) {
  if(!_.isArray(o)) {
    return;
  }
  o = _.compact(o);

  var isHelp,
      responseMsg,
      responseCls,
      room = user._room,
      command = cleanToken(o.shift());

  if(command=='help') {
    isHelp = true;
    command = cleanToken(o.shift());
  }

  switch(command) {
    case 'nick':
      var newname = o.shift();
      if(!newname || isHelp) {
        responseMsg = '<kbd>/nick [newname]</kbd><br/>';
        responseMsg += 'Change your name.';
      }
      else {
        if(!user.setName(newname)) {
          responseCls = 'oops';
          responseMsg = 'Sorry, you can\'t name yourself like that.';
        }
      }
      break;

    case 'img':
      var url = o.shift();
      if(isHelp || !url) {
        responseMsg = '<kbd>/img [url]</kbd><br/>';
        responseMsg += 'Post an image to the chatroom.';
      }
      else {
        // if(!user.sayImage(url, o.join(' '))) {
        //   responseCls = 'oops';
        //   responseMsg = 'Is that really a valid url?';
        // }
        responseCls = 'notimplemented';
      }
      break;

    case 'clear':
      if(isHelp) {
        responseMsg = '<kbd>/clear</kbd><br/>';
        responseMsg += 'Empty the conversation area.';
      }
      else {
        // room.empty();
        responseCls = 'notimplemented';
      }
      break;

    case 'join':
      if(!isHelp) {
        responseCls = 'oops';
      }
      responseMsg = '<kbd>/join [room]</kbd><br/>';
      responseMsg += 'Relocate to another room.';
      break;

    default:
      if(isHelp && command) {
        responseCls = 'oops';
        responseMsg = 'There is no <kbd>'+command+'</kbd> command.';
      }
      else {
        responseMsg = 'This is a per-URL chatroom. ';
        responseMsg += 'The current room is <em>'+room.id+'</em>. ';
        responseMsg += '<br/><br/>';
        responseMsg += 'Commands you can try: <kbd>/nick, /img, /clear, /join</kbd>.<br/>';
        responseMsg += 'Get help on a specific command with <kbd>/help [command]</kbd>.';
      }
  }

  if(responseCls=='notimplemented') {
    responseMsg = '<kbd>/'+command+'</kbd> command is not yet implemented :-(';
  }
  if(responseMsg) {
    return {
      msg: responseMsg,
      cls: responseCls||'help'
    }
  }
}


/* ================================================================ utilities */

function cleanToken(str) {
  return str ? str.replace(/\W/g,'') : '';
}
