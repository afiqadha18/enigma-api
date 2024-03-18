const router = require('express').Router();
const activity = require('../controllers/activity/activityLog');

router.route('/getActivityLogs')
    .get((req, res) => {
        activity.getActivityLogs(res);
    })

module.exports = router;