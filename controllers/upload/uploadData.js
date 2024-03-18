const db = require('../../config/db');
const logger = require('../../log/logger');

exports.getUploadData = async(req, res) => {
    try {
        let query = 'SELECT a.*, (SELECT email FROM user_account AS c WHERE b.uploadedBy = c.userID ) AS uploadedBy, b.uploadedOn, b.remarks FROM upload_data AS a LEFT OUTER JOIN upload_session AS b ON a.sessionId = b.sessionId';
        let rows = await db.query(query);
        // console.log(rows);
        logger.info('Getting list of uploaded data', { meta: { trace: 'uploadData.js' }});
        res.status(200).json({ data: rows });
    } catch (err) {
        logger.error(err.message, { meta: { trace: 'user.js', err: err }});
        res.status(400).send(err.message);
    }
}