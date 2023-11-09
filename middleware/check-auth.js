const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try{
        const token = req.header.authorization.split(" ")[1];
        jwt.verify(token,'secret-test-login-ikhmal');
        next();
    } catch {
        res.status(401).json({message: "Authentication failed"})
    }

}