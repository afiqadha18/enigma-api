const db = require('../../config/db');
const logger = require('../../log/logger');
const ipValidator = require('../../helper/ipValidator');
const activityLog = require('../activity/activityLog');
const dateHelper = require('../../helper/dateParser');

exports.getPeeringList = async (res) => {
    let query = 'SELECT * FROM peering_data';
    let rows = await db.query(query);

    res.status(200).json({ data: rows });
}

exports.addPeering = async (data, res) => {
    try {
        let isValid = await ipValidator.validateIp(data.peerIp);
        if (!isValid) return res.status(400).json({ error: 'Invalid ip address!'});

        let isExist = await checkDuplicatePeer(data.peerId);
        if (isExist) return res.status(409).json({ error: 'Duplicate Peer IP Address found!' });

        data.updatedBy = 'system_test';
        let currentTime = dateHelper.getCurrentTimestamp();
        let query = `INSERT INTO peering_data (peerName, peerAddress, peerAsn, localAsn, nextHopIp, bgpCommunity, bgpPassword, dataCenter, status, lastUpdatedBy, lastUpdatedOn)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        let rows = await db.query(query, [data.peerName, data.peerIp, data.peerAsn, data.localAsn, data.nextHopIp, data.bgpCommunity, data.bgpPassword, data.dataCenter,
        'active', data.updatedBy, currentTime]);

        activityLog.recordLog(data.updatedBy, 'bgp', 'active', null, 'BGP Peering added through user entry');
        logger.info('Insert new bgp peer with peerId: ' + rows.inserId, { meta: { trace: 'peering.js' }});

        return res.status(200).json({ message: 'Data has been added successfully!' })

    } catch (err) {
        console.error(err);
        logger.error(err.message, { meta: { trace: 'peering.js', err: err }});
    }
}

exports.editPeering = async (data, res) => {
    try {
        let isValid = await ipValidator.validateIp(data.peerIp);
        if (!isValid) return res.status(400).json({ error: 'Invalid ip address!'});

        let isExist = await checkPeerExist(data.peerId);
        if (isExist) {
            data.updatedBy = 'system_test';
            let currentTime = dateHelper.getCurrentTimestamp();
            let query = `UPDATE peering_data SET peerName = ?, peerAddress = ?, peerAsn = ?, localAsn = ?, nextHopIp = ?, bgpCommunity = ?, bgpPassword = ?, dataCenter = ?,
            status = ?, lastUpdatedBy = ?, lastUpdatedOn = ? WHERE peerId = ?`;
            let rows = await db.query(query, [data.peerName, data.peerIp, data.peerAsn, data.localAsn, data.nextHopIp, data.bgpCommunity, data.bgpPassword, data.dataCenter, 
            data.status, data.updatedBy, currentTime, data.peerId]);

            activityLog.recordLog(data.updatedBy, 'bgp', data.status, null, `BGP Peering data with peerId ${rows.inserId} has been updated`);
            logger.info('Insert new bgp peer with peerId: ' + rows.inserId, { meta: { trace: 'peering.js' }});

            return res.status(200).json({ message: 'Data has been updated successfully!' })
        } else return res.status(404).json({ error: 'Peer does not exist' })

    } catch (err) {
        console.error(err);
        logger.error(err.message, { meta: { trace: 'peering.js', err: err }});
    }
}

exports.deletePeering = async (peerId) => {
    try {
        let updatedBy = 'system_test';
        let isExist = await checkPeerExist(peerId);
        if (!isExist) return res.status(404).json({ message: 'Data not found!' });

        let query = 'DELETE FROM peering_data WHERE peerId = ?';
        let rows = await db.query(query, [peerId]);

        activityLog.recordLog(updatedBy, 'bgp', 'deleted', null, `BGP Peering data with peerId ${rows.inserId} has been deleted`);
        logger.info('Insert new bgp peer with peerId: ' + rows.inserId, { meta: { trace: 'peering.js' }});

        return res.status(200).json({ message: 'Data has been deleted successfully!' });
    } catch (err) {
        console.error(err);
        logger.error(err.message, { meta: { trace: 'peering.js', err: err }});
    }
}

async function checkPeerExist(peerId) {
    try {
        let query = `SELECT * FROM peering_data WHERE peerId = ?`;
        let rows = await db.query(query, [peerId]);

        if (rows.length > 0) return true;
        else return false;

    } catch (err) {
        console.error(err);
    }
}

async function checkDuplicatePeer(peerAddress) {
    try {
        let query = `SELECT * FROM peering_data WHERE peerAddress = ?`;
        let rows = await db.query(query, [peerAddress]);

        if (rows.length > 0) return true;
        else return false;

    } catch (err) {
        console.error(err);
    }
}