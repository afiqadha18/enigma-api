const db = require('../../config/db');
const logger = require('../../log/logger');
const ipValidator = require('../../helper/ipValidator');
const activityLog = require('../activity/activityLog');
const dateHelper = require('../../helper/dateParser');

exports.getPeeringList = async (res) => {
    // let query = 'SELECT * FROM peering_data';
    let query = 'SELECT peerId, peerName, peerAddress, peerAsn, localAsn, nextHopIp, bgpCommunity, bgpPassword, dataCenter, status, (SELECT username FROM user_account WHERE userID = lastUpdatedBy ) AS lastUpdatedBy, lastUpdatedOn FROM peering_data'
    let rows = await db.query(query);

    res.status(200).json({ data: rows });
}

exports.addPeering = async (req, res, data) => {
    try {
        let isValid = await ipValidator.validateIp(data.peerAddress);
        if (!isValid) return res.status(400).json({ error: `Invalid ip address ${data.peerAddress}`});

        // let isExist = await checkDuplicatePeer(data.peerAddress);
        // if (isExist) return res.status(409).json({ error: `Duplicate Peer IP Address found ${data.peerAddress}`});

        let isHopValid = await ipValidator.validateIp(data.nextHopIp);
        if (!isHopValid) return res.status(400).json({ error: `Invalid next hop ip address ${data.nextHopIp}`});

        let isBgpValid = await ipValidator.validateBgpCommunity(data.bgpCommunity);
        if (!isBgpValid) return res.status(400).json({ error: `Invalid bgp community ${data.bgpCommunity}`});

        let currentTime = dateHelper.getCurrentTimestamp();
        let query = `INSERT INTO peering_data (peerName, peerAddress, peerAsn, localAsn, nextHopIp, bgpCommunity, bgpPassword, dataCenter, status, lastUpdatedBy, lastUpdatedOn)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        let rows = await db.query(query, [data.peerName, data.peerAddress, data.peerAsn, data.localAsn, data.nextHopIp, data.bgpCommunity, data.bgpPassword, data.dataCenter,
        'active', req.userData.userID, currentTime]);

        activityLog.recordLog(req.userData.userID, 'bgp', 'active', null, 'BGP Peering added through user entry');
        logger.info('Insert new bgp peer with peerId: ' + rows.inserId, { meta: { trace: 'peering.js' }});

        return res.status(200).json({ message: 'Data has been added successfully!' })

    } catch (err) {
        console.error(err);
        logger.error(err.message, { meta: { trace: 'peering.js', err: err }});
    }
}

exports.editPeering = async (req, res, data) => {
    try {
        let isValid = await ipValidator.validateIp(data.peerAddress);
        if (!isValid) return res.status(400).json({ error: `Invalid ip address ${data.peerAddress}`});

        let isHopValid = await ipValidator.validateIp(data.nextHopIp);
        if (!isHopValid) return res.status(400).json({ error: `Invalid next hop ip address ${data.nextHopIp}`});

        let isBgpValid = await ipValidator.validateBgpCommunity(data.bgpCommunity);
        if (!isBgpValid) return res.status(400).json({ error: `Invalid bgp community ${data.bgpCommunity}`});

        let isExist = await checkPeerExist(data.peerId);
        if (!isExist) return res.status(404).json({ error: 'Peer does not exist' })
       
        let currentTime = dateHelper.getCurrentTimestamp();
        let query = `UPDATE peering_data SET peerName = ?, peerAddress = ?, peerAsn = ?, localAsn = ?, nextHopIp = ?, bgpCommunity = ?, bgpPassword = ?, dataCenter = ?,
        status = ?, lastUpdatedBy = ?, lastUpdatedOn = ? WHERE peerId = ?`;
        let rows = await db.query(query, [data.peerName, data.peerAddress, data.peerAsn, data.localAsn, data.nextHopIp, data.bgpCommunity, data.bgpPassword, data.dataCenter, 
        data.status, req.userData.userID, currentTime, data.peerId]);

        activityLog.recordLog(req.userData.userID, 'bgp', data.status, null, `BGP Peering data with peerId ${rows.inserId} has been updated`);
        logger.info('Insert new bgp peer with peerId: ' + data.peerId, { meta: { trace: 'peering.js' }});

        return res.status(200).json({ message: 'Data has been updated successfully!' })

    } catch (err) {
        console.error(err);
        logger.error(err.message, { meta: { trace: 'peering.js', err: err }});
    }
}

exports.deletePeering = async (req, res, peerId) => {
    try {
        let isExist = await checkPeerExist(peerId);
        if (!isExist) return res.status(404).json({ error: 'Data not found!' });

        let query = 'DELETE FROM peering_data WHERE peerId = ?';
        let rows = await db.query(query, [peerId]);

        activityLog.recordLog(req.userData.userID, 'bgp', 'deleted', null, `BGP Peering data with peerId ${peerId} has been deleted`);
        logger.info('Delete bgp peer with peerId: ' + peerId, { meta: { trace: 'peering.js' }});

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