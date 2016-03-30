var app = require('koa')(),
    koa = require('koa-router')(),
    logger = require('koa-logger'),
    json = require('koa-json'),
    views = require('koa-views'),
    onerror = require('koa-onerror'),
    r = require('rethinkdb'),
    config = require('../config'),
    assert = require('assert'),
    bluebird = require("bluebird"),
    IO = require('koa-socket'),
    io = new IO();

var coordinators = require('./controllers/coordinators');
var admins = require('./controllers/admins');

//var server = require('http').Server(app);

//var io = require('socket.io')(server);
io.attach(app);

var db = require('./db');

var dbHandle = r.db(config.rethinkdb[process.env.NODE_ENV || 'development'].db);

// global middlewares
app.use(views('views', {
    root: __dirname + '/views',
    default: 'jade'
}));

app.use(require('koa-bodyparser')());
app.use(json());
app.use(logger());

app.use(function*(next) {
    var start = new Date;
    yield next;
    var ms = new Date - start;
    console.log('%s %s - %s', this.method, this.url, ms);
});

app.use(require('koa-static')(__dirname + '/public'));

app.use(db.createConnection);

bluebird.coroutine(function*() {
    try {
        var connection = yield r.connect(config.rethinkdb[process.env.NODE_ENV || 'development']);
        var mainPageStore = yield require('./realtime/volunteer-store.js')(dbHandle, connection);

        var volunteers = require('./controllers/volunteers')(mainPageStore);

        require('./realtime/volunteers')(io, mainPageStore);

        koa.use('/', volunteers.routes(), volunteers.allowedMethods());
        koa.use('/coordinator', coordinators.routes(), coordinators.allowedMethods());
        koa.use('/admin', admins.routes(), admins.allowedMethods());

        // mount root routes  
        app.use(koa.routes());

        app.use(db.closeConnection);

        app.on('error', function(err, ctx) {
            log.error('server error', err, ctx);
        });

        console.log('Listening to ' + config.express.port);
        app.listen(config.express.port);

    } catch (err) {
        assert(err == null, err);
    }
})();


module.exports = app;