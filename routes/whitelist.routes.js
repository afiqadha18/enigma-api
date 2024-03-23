const router = require('express').Router();
const whitelist = require('../controllers/whitelist/whitelisting');
const checkAuth = require('../middleware/check-auth');

router.route('/ipWhitelist')
    .get((req, res) => {
        whitelist.getWhitelisted(req, res);
    })
    .post(checkAuth, (req, res) => {
        whitelist.addWhitelist(req, res, req.body);
    })

router.route('/ipWhitelist/:id')
    .delete(checkAuth, (req, res) => {
        whitelist.deleteWhitelist(req, res, req.params.id);
    })

module.exports = router;