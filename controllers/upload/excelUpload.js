'use strict';
const excelToJson = require('convert-excel-to-json');
const db = require('../../config/db');
const logger = require('../../log/logger');
const fs = require('fs');
const dotenv = require('dotenv').config();

let filePath = process.env.UPLOAD_PATH;

exports.uploadExcel = async (req, res, file, data) => {
    if (!file) res.status(400).json({ message: 'File not found!' });
    if (!data) res.status(400).json({ message: 'Data not found!'});

    let runningNo = await getRunningNo(file.name);
    let new_filename = file.name.split('.')[0] + '_' + runningNo + '.' + await getFileExtension(file.name);
    let fileDir = process.env.UPLOAD_PATH + new_filename;
    let isSave = await saveUploadedFile(file, fileDir);

    if (isSave) await updateFileRunningNo(file.name, runningNo);
    else res.status(400).json({
        error: true,
        message: 'Failed to save file!'
    })

    const result = excelToJson({
        sourceFile: fileDir,
        header: { rows: 1 },
        columnToKey: {
            '*': '{{columnHeader}}'
        }
    });

    if (result.Sheet1.length == 0) res.status(200).json({ message: 'No data extracted!'}); 

    let session_query = await getInsertQuery('session');
    let session_id = await executeInsertQuery('session', session_query, data, null);
    let data_query = await getInsertQuery('data');
    await executeInsertQuery('data', data_query, result.Sheet1, session_id);

    res.status(200).json({ message: 'file uploaded successfully' });
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

async function getRunningNo(filename) {
    return new Promise(async (res, rej) => {
        try {
            let runningNo = 0;
            let query = 'SELECT MAX(runningNo) AS runningNo FROM file_runningNo WHERE filename = ?';
            let rows = await db.query(query, filename);
            logger.info('Get latest runningNo for file: ' + filename, { meta: { trace: 'excelUpload.js' }});

            // console.log(query);
            if (rows.length === 0) runningNo = 1;
            else runningNo = rows[0].runningNo + 1;

            res(runningNo);

        } catch(err) {
            logger.error(err.message, { meta: { trace: 'excelUpload.js' }});
            rej(err.message);
        }
    })
}
 
async function saveUploadedFile(file, directory) {
    return new Promise((res, rej) => {
        try {
            file.mv(directory, (err) => {
                if (err) res(false);
                else {
                    logger.info('Moving file ' + file.name + ' to ' + directory, { meta: { trace: 'excelUpload.js' }});
                    res(true);
                }
            })
        } catch (err) {
            logger.error(err.message, { meta: { trace: 'excelUpload.js'}});
            rej(err.message);
        }
    })
}

async function updateFileRunningNo(filename, runningNo) {
    try {
        let query = 'INSERT INTO file_runningNo (filename, runningNo) VALUES (?, ?)';
        let rows = db.query(query, [filename, runningNo]);
        logger.info('Update latest runningNo for file: ' + filename, { meta: { trace: 'excelUpload.js' }});

        return;
    } catch (err) {
        logger.error(err.message, { meta: { trace: 'excelUpload.js', err: err }});
        console.error(err);
    }
}

async function getFileExtension(filename) {
    let ext = filename.split('.').pop();
    return ext;
}
