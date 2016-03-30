var router = require('koa-router')();

/* GET users listing. */
router.get('/', function*(next) {
	yield this.send('respond with a resource');
});

module.exports = router;