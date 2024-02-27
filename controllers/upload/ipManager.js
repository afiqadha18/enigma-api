const db = require('../../config/db');
const logger = require('../../log/logger');
const ipValidator = require('../../helper/ipValidator');

exports.addIp = async (req, res, data) => {
    let addresses = data.data.map(x => x.ipAddress);
    // console.log(addresses);
    let areInvaild = await checkIpAddressValidity(addresses); 
    if (areInvaild.length > 0) {
        return res.status(200).json({ 
            message: 'Invalid ip address found! Please fix those ip addresses.', 
            data: areInvaild 
        });
    }

    let session_query = await getInsertQuery('session');
    let session_id = await executeInsertQuery('session', session_query, data, null);
    let data_query = await getInsertQuery('data');
    await executeInsertQuery('data', data_query, data, session_id);

    return res.status(200).json({ message: 'Data added successfully' });
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
                rows = await db.query(query, [data.uploadedBy, data.uploadedOn, data.remarks]);
                logger.info('Insert upload data on upload_session for sessionId: ' + rows.insertId, { meta: { trace: 'excelUpload.js' }});
                res(rows.insertId);
            } else if (type === 'data') {
                for(const each of data) {
                    rows = await db.query(query, [sessionId, each.ipaddress, 60, 'active']);
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