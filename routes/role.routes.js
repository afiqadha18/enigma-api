const router = require('express').Router();
const role = require('../controllers/role');
const checkAuth = require('../middleware/check-auth')

router.route("/getRole")
    .get(checkAuth, (req, res) => {
        role.getRoles(req, res);
})

module.exports = router;