var express = require('express'),
    router = express.Router(),
    records_controller = require('../controllers/records');

/* REST API routes. Express middleware */
router.post('/records',    records_controller.add);    // generate records
router.get('/records',     records_controller.get);    // get records
router.delete('/records',  records_controller.delete); // drop records

module.exports = router;
