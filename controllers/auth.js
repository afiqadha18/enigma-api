const db = require('../config/db');
const logger = require('../log/logger');
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Console } = require('winston/lib/winston/transports');

exports.login = async (req, res)=>{
    try{
        console.log('User Login .......................');
        var firstTimeLogin = false;
        let query = 'SELECT * FROM user_account where username = ?';
        console.log("req : " + req.body.username )
        console.log("req : " + req.body.password )
        let rows = await db.query(query,[req.body.username]);
        console.log(Object.keys(rows).length);
        if(Object.keys(rows).length === 0){
            console.log("cant find username");
            return res.status(400)
            .json({
                message: "Username Invalid"
            })
        }
        console.log("pasword retreive: " +bcrypt.compare(req.body.password, rows[0].password)); 
        bcrypt.compare(req.body.password, rows[0].password, function(err, respond){
            if(err){

            }
            console.log("status: "+respond);
            if(respond){
                //check for firstime login
                if(rows[0].firstTimeLogin === "Y"){
                    console.log("first time login");
                    firstTimeLogin = true;
                }
                const token = jwt.sign(
                    {username: rows[0].username, userId: rows[0].userID},
                    'secret-test-login-ikhmal',
                    {expiresIn: '1h'});
                res.status(200).json({
                        token: token,
                        expiresIn: 3600,
                        userId: rows[0].userID,
                        username: rows[0].username,
                        firstTimeLogin: firstTimeLogin
                    });
            }else{
                console.log("incorrect password");
                return res.status(400)
                .json({message: "Incorrect Password"})
            }
        });

    } catch (error) {
        console.log("error Message: "+error.message);
        logger.error(error.message, { meta: { trace: 'user.js', err: error}});
        res.status(400).send(error.message);
    }
}