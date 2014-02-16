var middleware = require('./middleware.js'),
    Manager = require('./manager.js')
    fs = require('fs'),
    _ = require('underscore');

var locals = {
  head: fs.readFileSync('views/_head.html').toString()
};

module.exports = function(app) {


  app.get('/', function(req, res, next) {
    res.render('home', locals);
  });


  app.get('/room*', function(req, res, next) {
    var room = Manager.cleanRoomName(req.params[0]);

    if(room.length < 1) {
      return res.redirect('/');
    }

    res.render('room', _.extend(locals, {
      room: room.toLowerCase()
    }));
  });


};