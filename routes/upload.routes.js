const router = require('express').Router();
const upload = require('../controllers/upload/excelUpload');

router.route("/fileUpload")
    .post((req, res) => {
        let data = JSON.parse(req.body.data);
        let file = req.files.attachment;
        upload.uploadExcel(req, res, file, data);
})

module.exports = router;