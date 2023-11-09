const router = require('express').Router();
const user = require('../controllers/user');
const checkAuth = require('../middleware/check-auth')

router.route("/getUser")
    .get(checkAuth,(req, res) => {
        user.getUser(req, res);
})

router.route("/addUser")
    .post((req, res) => {
        let data = req.body;
        user.addUser(req, res, data)
    })

router.route("/editUser")
    .put((req, res) => {
        let data = req.body;
        user.editUser(req, res, data)
    })

router.route("/deleteUser/:userId")
    .delete((req, res) => {
        let userId = req.params.userId;
        user.deleteUser(req, res, userId);
    })

module.exports = router;