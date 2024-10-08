const db = require('../../config/db');
const logger = require('../../log/logger');
const ipValidator = require('../../helper/ipValidator');
const activityLog = require('../activity/activityLog');
const dateHelper = require('../../helper/dateParser');

exports.addIp = async (req, res, data) => {
    try {
        let addresses = data.data.map(x => x.ipAddress);
        // console.log(addresses);
        let areInvaild = await checkIpAddressValidity(addresses); 
        if (areInvaild.length > 0) {
            activityLog.recordLog('admin', 'blackhole', 'start', 'Invalid ip address found', 'Blackhole ip adderess added through user entry');
            return res.status(400).json({ 
                message: 'Invalid ip address found! Please fix those ip addresses.', 
                data: areInvaild 
            });
        }

        let areDuplicates = await checkIpDuplication(addresses);
        if (areDuplicates.length > 0) {
            activityLog.recordLog('admin', 'blackhole', 'start', 'Duplicate ip address found', 'Blackhole ip adderess added through user entry');
            return res.status(409).json({ 
                error: 'Duplicates IP Address found! Please fix those ip addresses.', 
                data: areDuplicates
            }); 
        }
        

        let session_query = await getInsertQuery('session');
        let session_id = await executeInsertQuery('session', session_query, data, null);
        console.log(session_id);
        
        let data_query = await getInsertQuery('data');
        await executeInsertQuery('data', data_query, data.data, session_id);
        activityLog.recordLog('admin', 'blackhole', 'start', null, 'Blackhole ip adderess added through user entry');

        return res.status(200).json({ message: 'Data added successfully' });
    } catch (err) {
        // console.error(err.message);
        logger.error(err.message, { meta: { trace: 'ipManager.js', err: err}});
    }
}

async function getInsertQuery(type) {
    let query;
    if (type === 'session') {
        query = 'INSERT INTO upload_session (uploadedBy, uploadedOn, remarks) VALUES (?, ?, ?)';
    } else if (type === 'data') {
        query = 'INSERT INTO upload_data (sessionId, ip_address, duration, status) VALUES (?, ?, ?, ?)';
    } else {
        query = '';
    }

    return query;
}

async function executeInsertQuery(type, query, data, sessionId) {
    return new Promise(async (res, rej) => {
        try {
            let rows;
            if (type === 'session') {
                let currentTime = dateHelper.getCurrentTimestamp();
                rows = await db.query(query, ['user-uuid', currentTime, 'Remarks from API']);
                // rows = await db.query(query, [data.uploadedBy, data.uploadedOn, data.remarks]);
                logger.info('Insert upload data on upload_session for sessionId: ' + rows.insertId, { meta: { trace: 'excelUpload.js' }});
                res(rows.insertId);
            } else if (type === 'data') {
                console.log(data);
                for(const each of data) {
                    rows = await db.query(query, [sessionId, each.ipAddress, each.duration, 'active']);
                    logger.info('Insert upload data on upload_data for sessionId: ' + sessionId, { meta: { trace: 'excelUpload.js' }});
                }
                res(true);
            }
        } catch (err) {
            logger.error(err.message, { meta: { trace: 'excelUpload.js', err: err, query: query }});
            rej(err.message);
        }
    })
}

async function checkIpAddressValidity(ipArray) {
    let invalidArray = [];
    for (const each of ipArray) {
        let status = await ipValidator.validateIp(each);
        if (!status) invalidArray.push(each);
    }

    return invalidArray;
}

async function checkIpDuplication(ipArray) {
    let duplicatesIp = [];
    let existingIps = await getExisitngIps();
    if (existingIps) duplicatesIp = ipArray.filter(value => existingIps.some(oneElement => oneElement.ip_address === value));

    return duplicatesIp;
}

async function getExisitngIps() {
    return new Promise((res, rej) => {
        try {
            let query = 'SELECT ip_address FROM upload_data';
            let rows = db.query(query);

            if (rows.length != 0) res(rows);
            else res(false);

        } catch (err) {
            rej(err);
        }
    })
}
