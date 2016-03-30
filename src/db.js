var r = require('rethinkdb');
var config = require('../config');

module.exports = {
    createConnection: function*(next) {
        var conn = yield r.connect(config.rethinkdb[process.env.NODE_ENV || 'development']);
        this.rdbConn = conn;
        yield next;
    },
    closeConnection: function*(next) {
        this.rdbConn.close();
        yield next;
    }
};