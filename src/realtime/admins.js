var assert = require('assert');

module.exports = function*(io, db, conn) {
    io.on('connection', function(socket) {
        socket.on('admin-dashboard-init', function() {
            db.table('event').run(conn, function(err, cursor) {
                assert(err == null, err);
                var data = [];
                cursor.toArray(function(err, data) {
                    socket.emit('admin-dashboard-init', data);

                    db.table('event').changes().run(conn, function(err, cursor) {
                        cursor.each(function(err, row) {
                            assert(err == null, err);

                            socket.emit('admin-dashboard-update', row);
                        });
                    });
                });
            });
        });
    });
}