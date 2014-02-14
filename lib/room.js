var _ = require('underscore'),
    util = require('util'),
    events = require('events');

module.exports = Room;
/* ================================================================ Room */

function Room(id, topic) {
  events.EventEmitter.call(this);
  return _(this).defaults({
    id: id,
    buffer: [],
    roster: []
  });
};

util.inherits(Room, events.EventEmitter);

_.extend(Room.prototype, {

  hasUser: function(user) {
    return _(this.roster).any(function(member) {
      return member.id == user.id;
    });
  },

  addUser: function(user) {
    var u = user.flat();
    if(this.hasUser(u)) return;
    this.roster.push(u);
    this.log('addUser: '+u.name);
    this.emit('roster-update', 'join', u);
  },

  removeUser: function(user) {
    var whoDat, that = this;
    this.roster = _(this.roster).reject(function(member) {
      if(member.id == user.id) {
        that.log('removeUser: '+member.name);
        return (whoDat = member);
      }
    });
    if(whoDat) {
      this.emit('roster-update', 'gone', whoDat);
    }
  },

  log: function(m) {
    console.log('[room/'+this.id+'] '+m);
  },

  update: function(user, input, imgUrl) {
    if(this.hasUser(user)) {
      var msg = new Message(user, input, imgUrl);
      if(msg.text || msg.image) {
        this.buffer.push(msg);
        this.emit('conversation-update', msg);
        if(this.buffer.length>15) {
          this.buffer.shift();
        }
        return msg;
      }
    }
  }

});



/* ================================================================ Message */

function Message(user, input, imgUrl) {
  var out = _(this).defaults({
    text: input.replace(/\<.*\>/g, ""), // strip tags
    user: user.flat(),
    time: (new Date()).getTime()
  });
  if(imgUrl && imgUrl.match(/^(data\:image\/|(https?\:)?\/\/[^\<\>]+)/)) {
    out.text = out.text || imgUrl;
    out.image = imgUrl;
  }
  return out;
};