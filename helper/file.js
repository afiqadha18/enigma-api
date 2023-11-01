const moment = require('moment');

exports.getFileExtension = (filename) => {
    let ext = filename.split('.').pop();
    return ext;
}

exports.getRawFileName = (filename) => {
    let rawName = filename.split('.')[0];
    return rawName;
}

