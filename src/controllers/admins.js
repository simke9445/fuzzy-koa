var router = require('koa-router')();

/* GET coordinator page. */
router.get('/dashboard/', function*(next) {
	yield this.render('admin-dashboard');
});

module.exports = router;