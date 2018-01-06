const 
    express = require('express'),
    router = express.Router(),
    debtManager = require('./debt-manager.js'),
    usersManager = require('./users-manager.js');

router.route('/add').post((req, res) => {  
    const body = req.body;

    usersManager.getUserData(body.psid)
        .then(user => {
            debtManager.addDebt(user.id, body.threadId, body.debtType, body.amount);
            res.status(200).send();
        })
        .catch(error => res.status(500).send(error));
});

router.route('/accept/:id').post((req, res) => {  
    const body = req.body;

    usersManager.getUserData(body.psid)
        .then(user => {
            debtManager.acceptDebt(req.params.id, user.id);
            res.status(200).send();
        })
        .catch(error => res.status(500).send(error));
});

module.exports = router;