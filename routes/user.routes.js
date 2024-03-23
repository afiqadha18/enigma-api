const router = require('express').Router();
const user = require('../controllers/user');
const checkAuth = require('../middleware/check-auth')

router.route("/changePasswordFirstLogin")
    .post(checkAuth, (req, res) => {
        let data = req.body;
        user.changePassword(req,res, data)
    })

router.route("/getUser/:userId")
    .get(checkAuth,(req,res) => {
        let userId = req.params.userId;
        user.getUser(req, res, userId)

    })

router.route("/getAllUser")
    .get(checkAuth,(req, res) => {
        user.getAllUser(req, res);
    })

router.route("/addUser")
    .post(checkAuth,(req, res) => {
        let data = req.body;
        user.addUser(req, res, data)
    })

router.route("/editUser")
    .put(checkAuth,(req, res) => {
        let data = req.body;
        user.editUser(req, res, data)
    })

router.route("/deleteUser/:userId")
    .delete(checkAuth,(req, res) => {
        let userId = req.params.userId;
        user.deleteUser(req, res, userId);
    })

module.exports = router;