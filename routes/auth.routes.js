const router = require('express').Router();
const login = require('../controllers/authentication/auth');

router.route("")
.post((req,res) => { 
    console.log("route: "+req.body.username);
    login.login(req, res);
})

module.exports = router