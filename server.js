var express = require('express')
  , app = express();

app.set('pkg', require('./package.json'));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

app.configure('development', function(){
    app.use(express.logger('dev'));
});

app.configure('production', function(){
    app.use(express.logger());
    app.use(express.compress());
});

app.use(express.favicon());
app.use('/public', express.directory('./public', {icons:true}));
app.use('/public', express.static('./public'));

// app.use(express.query());
// app.use(express.urlencoded());
// app.use(express.json());

app.use(express.cookieParser());
// app.use(express.cookieSession({secret:'tops3cr3t'}));
// app.use(express.csrf());

require('./lib/routes.js')(app);
app.use(app.router);

express.errorHandler.title = app.get('pkg').name.toUpperCase();

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('test', 'production', function(){
    app.use(express.errorHandler());
});

app.use(function(req, res, next){
    var err = new Error('Not found');
    err.status = 404;
    express.errorHandler()(err, req, res);
});

var server = require('http').createServer(app)
  , socketio = require('./lib/io.js');

function up(config, callback) {
    config = config || {};

    process.on('uncaughtException', function (exception) {
        // danger! see https://github.com/joyent/node/issues/2582
        console.error("\nuncaughtException", exception);
    });

    var port = config.port || 3000;
    app.set('port', port);

    server.listen(port, function() {
        console.log(
            "[%s] v%s listening on port %d in %s mode"
          , app.get('pkg').name
          , app.get('pkg').version
          , port
          , app.settings.env
        );

        socketio(server, app);

        if(callback) {
          callback.call(app);
        }
    });
}

if(!module.parent) {
    up();
}

module.exports = {
    up: up
  , app: app
};

