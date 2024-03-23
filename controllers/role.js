const db = require('../config/db');
const logger = require('../log/logger');
exports.getRoles = async (req, res) => {
    try {
      console.log('Getting Role.......................');
      let query = 'SELECT * FROM user_role';
      let rows = await db.query(query);
      console.log(rows);
      logger.info('Getting list of roles', { meta: { trace: 'role.js' }});
      res.status(200).json({ roles: rows });
    } catch (error) {
      logger.error(error.message, { meta: { trace: 'role.js', err: error, query: query }});
      res.status(400).send(error.message);
    }
}
