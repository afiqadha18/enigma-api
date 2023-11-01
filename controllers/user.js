const db = require('../config/db');
const logger = require('../log/logger');

exports.getUser = async (req, res) => {
    try {
      console.log('Getting new user.......................');
      let query = 'SELECT * FROM user_table';
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
    let query = 'INSERT INTO user_table (email, password) VALUES (?, ?)';
    let rows = await db.query(query, [data.email, data.password]);
    console.log(rows);
    logger.info('Adding new list of user with userId:' + rows.insertId, { meta: { trace: 'user.js' }});
    res.status(200).json({
      'err': false,
      'message': 'New user added successfully with userId: ' + rows.insertId
    });
  } catch (error) {
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
    console.log('Deleting user...............................');
    let query = 'DELETE FROM user_table WHERE userId = ?';
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