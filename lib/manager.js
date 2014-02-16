var _ = require('underscore'),
    util = require('util'),
    events = require('events'),
    Room = require('./room.js');


module.exports = Manager;
/* ================================================================ Manager */

function Manager() {
  events.EventEmitter.call(this);

  setInterval((function(){

    this.emit('tick', {
      roomCount: _.size(this.rooms)
    , sinceStart: now()-this.startedAt
    , tree: this.tree()
    });

  }).bind(this), 3000);

  return _(this).defaults({
    rooms: {},
    startedAt: now()
  });
};

util.inherits(Manager, events.EventEmitter);

Manager.cleanRoomName = function(name) {
  return name.replace(/_/g, '').replace(/\/$/, '').toLowerCase();
}

_.extend(Manager.prototype, {

  get: function(name) {
    name = Manager.cleanRoomName(name);

    if(this.rooms[name]) {
      return this.rooms[name];
    }
    else {
      var room = new Room(name);
      this.rooms[name] = room;
      return room;
    }
  }

, tree: function() {
    var out = {};
    _.each(this.rooms, function(room, name) {
      var o = out
        , d = name.split('/').slice(1);

      for (var i=0, m=d.length; i<m; i++) {
        if(i<m-1) {
          var n = d[i];
          o[n] = o[n] || {};
          o = o[n]; // drill down into namespace
        }
        else {
          o[d[i]] = { '_': [room.roster.length, room.buffer.length] };
        }
      }
    });
    return out;
  }

});


function now() {
  return Math.floor(Date.now()/1000);
}
