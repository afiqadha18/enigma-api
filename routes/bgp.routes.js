const router = require('express').Router();
const bgp = require('../controllers/bgp/peering');

router.route('/bgpPeer')
    .get((req, res) => {
        bgp.getPeeringList(res);
    })
    .post((req, res) => {
        bgp.addPeering(req.body, res);
    })
    .put((req, res) => {
        bgp.editPeering(req.body, res);
    })

router.route('/bgpPeer/:id')
    .delete((req, res) => {
        bgp.deletePeering(req.params.id, res);
    })

module.exports = router;