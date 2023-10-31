const router = require('express').Router();
const user = require('../controllers/user');

router.route("/getUser")
    .get((req, res) => {
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

router.route("/deleteUser")
    .delete((req, res) => {
        let userId = req.query.userId;
        user.deleteUser(req, res, userId);
    })

module.exports = router;