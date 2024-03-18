const router = require('express').Router();
const excel = require('../controllers/upload/excelUpload');
const ipManager = require('../controllers/upload/ipManager');
const upload = require('../controllers/upload/uploadData');

router.route("/fileUpload")
    .post((req, res) => {
        // console.log(req);
        let data = JSON.parse(req.body.data);
        let file = req.files.attachment;
        excel.uploadExcel(req, res, file, data);
})

router.route("/addIp")
    .post((req, res) => {
        let data = req.body;
        ipManager.addIp(req, res, data);
    })

router.route("/getUploadData")
    .get((req, res) => {
        upload.getUploadData(req, res);
    })

module.exports = router;