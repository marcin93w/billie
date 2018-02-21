const 
    express = require('express'),
    router = express.Router(),
    logger = require('../utils/logger');


router.route('/').post((req, res) => { 
   logger.warn(new Error('Frontend issue: ' + JSON.stringify(req.body)))
   res.send(200)
});

module.exports = router;