const db = require('../../config/db');
const logger = require('../../log/logger');
const ipValidator = require('../../helper/ipValidator');
const dateHelper = require('../../helper/dateParser');
const moment = require('moment');

exports.recordLog = async (username, eventName, execution, error, remarks) => {
    let query;
    try {
        query = 'INSERT INTO activity_log (activityDate, username, events, execution, error, remarks) VALUES (?, ?, ?, ?, ?, ?)';
        // console.log(query);
        let rows = await db.query(query, [dateHelper.getCurrentTimestamp(), username, eventName, execution, error, remarks]);
        logger.info('Activity recorded with for id: ' + rows.insertId, { meta: { trace: 'activityLog.js' }});

    } catch (err) {
        console.error(err);
        logger.error(err.message, { meta: { trace: 'activityLog.js', err: err, query: query }});
    }
}

exports.getActivityLogs = async (res) => {
    let query = 'SELECT * FROM activity_log';
    let rows = await db.query(query);
    
    logger.info('Getting list of activity logs', { meta: { trace: 'activityLog.js' }});
    res.status(200).json({ data: rows });
}