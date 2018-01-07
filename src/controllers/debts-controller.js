const 
    express = require('express'),
    router = express.Router(),
    DebtManager = require('../debt-manager/debt-manager.js'),
    debtsRepository = require('../repository/debts-repository.js'),
    usersManager = require('../debt-manager/users-manager.js');

const debtManager = new DebtManager(debtsRepository);

router.route('/add').post((req, res) => {  
    const body = req.body;

    usersManager.getUserData(body.psid)
        .then(user => {
            const debtId = debtManager.addDebt(user.id, body.threadId, body.debtType, body.amount);
            res.status(200).send({
                debtId: debtId,
                userName: user.name,
                userGender: user.gender
            });
        })
        .catch(error => res.status(500).send(error));
});

router.route('/accept/:id').post((req, res) => {  
    const body = req.body;

    usersManager.getUserData(body.psid)
        .then(user => {
            const debt = debtManager.acceptDebt(req.params.id, user.id);
            if  (!debt) {
                throw new Error('Debt not accepted')
            }
            res.status(200).send({
                debt,
                userName: user.name
            });
        })
        .catch(error => res.status(500).send(error));
});

module.exports = router;