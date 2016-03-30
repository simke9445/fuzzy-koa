var router = require('koa-router')();
var io = require('koa-socket');
var ReactDOMServer = require('react-dom/server');
var React = require('react');
var VolunteerList = require('../../dist/component.bundle.js').VolunteerList;

var localStore = null;

/* GET volunteer listing. */
router.get('/', function*(next) {
    
    var cardEntries = VolunteerList({
        cards: localStore.getState().entries
    });

    var cardList = ReactDOMServer.renderToString(cardEntries);

    yield this.render('volunteer-list', {
        mainList: cardList,
        state: JSON.stringify(localStore.getState().entries)
    });
});

router.post('/signup', function*(next) {
    console.log(req.body);

    var cardList = ReactDOMServer.renderToString(VolunteerList({
        cards: localStore.getState().entries
    }));

    yield this.redirect('/');
});

router.post('/profile', function*(next) {
    console.log(req.body);

    yield this.render('volunteer-detail');
});

module.exports = function(dataStore) {
    localStore = dataStore;

    return router;
}