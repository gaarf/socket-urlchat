var _ = require('underscore'),
    util = require('util'),
    events = require('events'),
    slashCommand = require('./commands.js').slash;

module.exports = User;
/* ================================================================ User */

function User(id) {
  events.EventEmitter.call(this);
  return _(this).defaults({
    name: null,
    id: id
  });
};

util.inherits(User, events.EventEmitter);

_.extend(User.prototype, {

  processMessage: function(obj) {
    var that = this;
    _(obj).each(function(o, k) {
      switch(k) {

        case 'hello':
          that.setName(o.name, o.ua);
        break;

        case 'compo':
          if(that._room) {
            that.say(o);
          }
        break;

        case 'slash':
          that.processSlash(o);
        break;

      }
    });
  },

  processSlash: function(o) {
    var res = slashCommand(this, o);
    if(res && res.msg) {
      this.emit('slash-response', res.msg, res.cls);
    }
  },

  setName: function(name, ua) {
    if(!name && ua) {
      name = _("Chrome,Safari,Firefox,Microsoft,Mozilla".split(',')).detect(function(w) {
        if(ua.match(w)) { return w; }
      }) + '_' + this.id.replace(/_|-/g, '');
    }
    name = name && name.replace(/\W/g,'');
    if(name) {
      if(this._room && this._room.hasUser({name:name})) {
        return false;
      }
      this.name = name;
      if( this._room ) {
        this._room.renameUser(this); // triggers roster event
        this.emit('name-update', name);        
      }
      return true;
    }
    else {
      return (this.name = this.id);
    }
  },

  joinRoom: function(room) {
    this.partRoom(room);
    if(room) {
      room.addUser(this);
      this._room = room;
    }
  },

  partRoom: function(room) {
    room = room || this._room;
    if(room) {
      room.removeUser(this);
    }
    this._room = null;
  },

  say: function(input) {
    if(this._room && input) {
      return this._room.update(this, input);
    }
  },

  sayImage: function(url, addInput) {
    if(this._room && url) {
      return this._room.update(this, addInput, url);
    }
  },

  flat: function() {
    return _.pick(this, 'id', 'name') ;
  }

});
