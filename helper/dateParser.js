const moment = require('moment');

exports.getCurrentDate = () => {
    let now = moment(new Date()).format('YYYY-MM-DD');
    return now;
}

exports.getCurrentTimestamp = function () {
    let nowTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    return nowTime;
}

exports.reformatDate = (date) => {
    let newDate = moment(new Date(date)).format('YYYY-MM-DD');
    return newDate;
}