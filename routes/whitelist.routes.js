const router = require('express').Router();
const whitelist = require('../controllers/whitelist/whitelisting');

router.route('/ipWhitelist')
    .get((req, res) => {
        whitelist.getWhitelisted(req, res);
    })
    .post((req, res) => {
        whitelist.addWhitelist(req.body, res);
    })
//     .put((req, res) => {
//         bgp.editPeering(req.body, res);
//     })

// router.route('/ipWhitelist/:id')
//     .delete((req, res) => {
//         bgp.deletePeering(req.params.id, res);
//     })

module.exports = router;