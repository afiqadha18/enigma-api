const db = require('../config/db');
const logger = require('../log/logger');
const uuid = require('uuid');
const bcrypt = require('bcrypt');

exports.getUser = async(req, res , userId) =>{
  try {
    console.log('Getting user based on ID.......................');
    let query = 'SELECT * FROM user_account where userID = ?';
    let rows = await db.query(query, [userId]);
    console.log(rows);
    logger.info('Getting user information', { meta: { trace: 'user.js' }});
    res.status(200).json({ user: rows });
  }catch (error) {
    logger.error(error.message, { meta: { trace: 'user.js', err: error, query: query }});
    res.status(400).send(error.message);
  }
}

exports.getAllUser = async (req, res) => {
    try {
      console.log('Getting new user.......................');
      let query = 'SELECT * FROM user_account';
      let rows = await db.query(query);
      console.log(rows);
      logger.info('Getting list of users', { meta: { trace: 'user.js' }});
      res.status(200).json({ user: rows });
    } catch (error) {
      logger.error(error.message, { meta: { trace: 'user.js', err: error, query: query }});
      res.status(400).send(error.message);
    }
}

exports.addUser = async (req, res, data) => {
  try {
    console.log('Adding new user............................');
    const user_uuid = uuid.v4();
    let hashPassword;
    console.log("re userdata: "+req.userData);
    console.log("test req user data :" + req.userData.userID);
    const creator_userId = req.userData.userID;
    let query = 'INSERT INTO user_account (userID, username, password, email, firstTimeLogin, status, role, created_by, created_datetime, lastLogin ) VALUES (?, ?, ?, ?, "Y", "Active", ?, ?, NOW(), NOW())';
    bcrypt.hash("DEFAULT123",10)
    .then(async hash =>{
      hashPassword = hash;
      console.log('Query new user: '+ query);
      console.log('userUUID: '+ user_uuid);
      console.log('user hash password: '+ hashPassword);
      let rows = await db.query(query, [user_uuid ,data.username , hashPassword, data.email, data.role, creator_userId]);
      console.log(rows);
      logger.info('Adding new list of user with userId:' + rows.insertId, { meta: { trace: 'user.js' }});
      res.status(200).json({
       'err': false,
        'message': 'New user added successfully with userId: ' + rows.insertId,
       'userID': user_uuid,
       'firstTimeLogin': 'Y',
        'status': 'Active'
      });
    });
    
  } catch (error) {
    console.log("error"+error.message);
    logger.error(error.message, { meta: { trace: 'user.js', err: error, query: query }});
    res.status(400).send(error.message);
  }
}

exports.editUser = async (req, res, data) => {
  try {
    console.log('Adding new user............................');
    let query = 'UPDATE user_table SET email = ?, password = ? WHERE userId = ?';
    let rows = await db.query(query, [data.email, data.password, data.userId]);
    console.log(rows);
    logger.info('Update user details of userId:' + data.userId, { meta: { trace: 'user.js' }});
    res.status(200).json({
      'message': 'Update user successfully'
    });
  } catch (error) {
    logger.error(error.message, { meta: { trace: 'user.js', err: error, query: query }});
    res.status(400).send(error.message);
  }
}

exports.deleteUser = async (req, res, userId) => {
  try {
    console.log('Deleting user............................... '+ userId);
    let query = 'DELETE FROM user_account WHERE userId = ?';
    let rows = await db.query(query, userId);
    console.log(rows);
    logger.info('Deleting user of userId:' + userId, { meta: { trace: 'user.js' }});
    res.status(200).json({
      'message': 'Delete user successfully'
    });
  } catch (error) {
    logger.error(error.message, { meta: { trace: 'user.js', err: error, query: query }});
    res.status(400).send(error.message);
  }
}