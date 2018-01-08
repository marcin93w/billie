const 
    express = require('express'),
    router = express.Router(),
    DebtManager = require('../debt-manager/debt-manager.js'),
    debtsRepository = require('../repository/debts-repository.js'),
    usersManager = require('../debt-manager/users-manager.js');

const debtManager = new DebtManager(debtsRepository);

router.route('/add').post((req, res) => {  
    const body = req.body;

    if(!validateAddRequest(body)) {
        res.status(400).send({error: "validation error"});
        return;
    }

    usersManager.getUserData(body.psid)
        .then(user => {
            const debtId = debtManager.addDebt(user.id, body.threadId, body.debtType, parseFloat(body.amount));
            res.status(200).send({
                debtId: debtId,
                userName: user.name,
                userGender: user.gender
            });
        })
        .catch(err => sendErrorMessage(res, err));
});

function validateAddRequest(body) {
    return body.psid && body.threadId && body.amount && parseFloat(body.amount) !== NaN;
} 

router.route('/accept/:id').post((req, res) => {  
    const body = req.body;

    if(!validateAcceptRequest(body)) {
        res.status(400).send({error: "validation error"});
        return;
    }

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
        .catch(err => sendErrorMessage(res, err));
});

function validateAcceptRequest(body) {
    return body.psid;
} 

router.route('/status/:psid').get((req, res) => {
    usersManager.getUserData(req.params.psid)
        .then(user => {
            const balance = debtManager.getDebtStatus(user.id);
            res.status(200).send({
                balance
            });
        })
        .catch(err => sendErrorMessage(res, err));
});

function validateAcceptRequest(body) {
    return body.psid;
} 

function sendErrorMessage(res, error) {
    res.status(500).send({
        error: error.message || error
    })
}

module.exports = router;