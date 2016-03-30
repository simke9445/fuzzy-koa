var React = require('react');
var ReactDOMServer = require('react-dom/server');
var router = require('koa-router')();
//var CardList = require('../../src-client/card-list.jsx');

/* GET home page. */
router.get('/', function*(next) {
	//var elem = ReactDOMServer.renderToString(
	//  React.createElement(CardList, {})
	//);

	//res.render('index', { title: 'Express' });
});

module.exports = router;