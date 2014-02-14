var middleware = require('./middleware.js')
  , fs = require('fs')
  , _ = require('underscore');

var locals = {
  head: fs.readFileSync('views/_head.html').toString()
};

module.exports = function(app) {


  app.get('/', function(req, res, next) {
    res.render('home', locals);
  });


  app.get('/room*', function(req, res, next) {
    var room = req.params[0];

    if(room.length < 2) {
      return res.redirect('/');
    }

    // remove starting and trailing slashes
    room = room.replace(/^\/|\/$/g,'');

    res.render('room', _.extend(locals, {
      room: room
    }));
  });


};