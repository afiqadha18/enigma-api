const db = require('../config/db');
const logger = require('../log/logger');
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = async (req, res)=>{
    try{
        console.log('User Login .......................');
        let query = 'SELECT * FROM user_account where username = ?';
        console.log("req : " + req.body.username )
        console.log("req : " + req.body.password )
        let rows = await db.query(query,[req.body.username]);
        console.log(rows[0].password);
        if(rows === ""){
            console.log("cant find username");
            return res.status(400)
            .json({
                message: "Username Invalid"
            })
        }
        if(!(bcrypt.compare(req.body.password, rows[0].password))){
            console.log("incorrect password");
            return res.status(400)
            .json({
                message: "Password Incorrect"
            })
        }
        //check for firstime login
        // if(rows[0].firstTimeLogin === "Y"){
        //     console.log("first time login");
        //     return res.status(200)
        //     .json({
        //         message: "prompt change password"
        //     })
        // }
        const token = jwt.sign(
            {username: rows.username, userId: rows.userID},
            'secret-test-login-ikhmal',
            {expiresIn: '1h'});
        res.status(200).json({
            token: token
        });

    } catch (error) {
        logger.error(error.message, { meta: { trace: 'user.js', err: error, query: query }});
        res.status(400).send(error.message);
    }
}