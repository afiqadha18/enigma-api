const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try{
        console.log("token bearer :" + req.headers.Authorization);
        const token = req.headers.authorization.split(" ")[1];
        console.log("token bearer :" + req.header.authorization);
        console.log("token :" + token);
        const decodeToken = jwt.verify(token,'secret-test-login-ikhmal');
        console.log("userid: "+decodeToken.userId);
        console.log("userid: "+decodeToken.username);
        req.userData = { username: decodeToken.username , userID: decodeToken.userId};
        next();
    } catch {
        res.status(401).json({message: "Authentication failed"})
    }

}