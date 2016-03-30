var Redux = require('redux');
var assert = require('assert');
var entries = require('./entries');
var actions = require('./volunteer-actions');
var bluebird = require('bluebird');

var createStore = Redux.createStore;
var combineReducers = Redux.combineReducers;

/**
 * Server only reducer for dispatching actions over socket
 */
function action(state, action) {
    return action;
}

/**
 * Store creation and connection to database
 */
module.exports = bluebird.coroutine(function*(db, conn) {
    var data = yield db.table('event').run(conn);

    var reducer = combineReducers({
        entries,
        action
    });

    var mainPageStore = createStore(reducer, {
        entries: data.toArray(),
        action: null
    });

    var cursor = yield db.table('event').changes().run(conn);
    cursor.each(function(err, row) {
        assert(err == null, err);

        mainPageStore.dispatch(actions.getAction(row));
    });

    return mainPageStore;
});