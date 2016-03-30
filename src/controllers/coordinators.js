var router = require('koa-router')();

/* GET coordinator page. */
router.get('/dashboard/', function*(next) {
	yield this.render('coordinator-dashboard');
});

router.post('/create', function*(next) {

});

module.exports = router;