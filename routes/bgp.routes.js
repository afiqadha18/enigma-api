const router = require('express').Router();
const bgp = require('../controllers/bgp/peering');
const checkAuth = require('../middleware/check-auth');

router.route('/bgpPeer')
    .get((req, res) => {
        bgp.getPeeringList(res);
    })
    .post(checkAuth, (req, res) => {
        bgp.addPeering(req, res, req.body);
    })
    .put(checkAuth, (req, res) => {
        bgp.editPeering(req, res, req.body);
    })

router.route('/bgpPeer/:id')
    .delete(checkAuth, (req, res) => {
        bgp.deletePeering(req, res, req.params.id);
    })

module.exports = router;