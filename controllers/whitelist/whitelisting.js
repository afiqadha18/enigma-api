const db = require('../../config/db');
const logger = require('../../log/logger');
const ipValidator = require('../../helper/ipValidator');
const activityLog = require('../activity/activityLog');
const dateHelper = require('../../helper/dateParser');

exports.getWhitelisted = async (req, res) => {
    let query = 'SELECT * FROM whitelist_data';
    let rows = await db.query(query);

    res.status(200).json({ data: rows });
}

exports.addWhitelist = async (data, res) => {
    try {
        let isValid = await ipValidator.validateIp(data.ipAddress);
        if (!isValid) return res.status(400).json({ error: `Invalid ip address ${data.ipAddress}`});

        let isExist = await checkDuplicateIP(data.ipAddress);
        if (isExist) return res.status(409).json({ error: `Duplicate ip address ${data.ipAddress}`});

        let query = 'INSERT INTO whitelist_data (ipAddress, description, addedBy, addedDate) VALUES (?, ?, ?, ?)';
        let rows = await db.query(query, [data.ipAddress, data.description, 'system_test', dateHelper.getCurrentTimestamp()]);

        activityLog.recordLog('system_test', 'whitelist', 'active', null, 'IP Whitelist added through user entry');
        logger.info('Insert new ip whitelist with listId: ' + rows.inserId, { meta: { trace: 'whitelisting.js' }});

        return res.status(200).json({ message: 'Data has been added successfully!' })
    } catch (err) {
        console.error(err);
    }
}

async function checkDuplicateIP(ipAddress) {
    try {
        let query = `SELECT * FROM whitelist_data WHERE ipAddress = ?`;
        let rows = await db.query(query, [ipAddress]);

        if (rows.length > 0) return true;
        else return false;

    } catch (err) {
        console.error(err);
    }
}