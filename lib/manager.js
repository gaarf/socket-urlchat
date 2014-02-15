var _ = require('underscore'),
    util = require('util'),
    events = require('events'),
    Room = require('./room.js');


module.exports = Manager;
/* ================================================================ Manager */

function Manager(id, topic) {
  events.EventEmitter.call(this);

  setInterval((function(){

    this.emit('tick', {
      roomCount: _.size(this.rooms)
    , tick: this.ticks++
    });

  }).bind(this), 5000);

  return _(this).defaults({
    rooms: {},
    ticks: 0
  });
};

util.inherits(Manager, events.EventEmitter);

_.extend(Manager.prototype, {

  get: function(name) {
    if(this.rooms[name]) {
      return this.rooms[name];
    }
    else {
      var room = new Room(name);
      this.rooms[name] = room;
      return room;
    }
  }

});

