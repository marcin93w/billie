const 
    express = require('express'),
    router = express.Router(),
    DebtManager = require('../debt-manager/debt-manager.js'),
    debtsRepository = require('../repository/debts-repository.js'),
    UsersManager = require('../debt-manager/users-manager.js'),
    usersRepository = require('../repository/users-repository.js'),
    threadsRepository = require('../repository/threads-repository.js'),
    usersGraphApi = require('../graph-api/user.js');

const debtManager = new DebtManager(debtsRepository);
const usersManager = new UsersManager(usersGraphApi, usersRepository, threadsRepository);

router.route('/add').post((req, res) => {  
    const body = req.body;

    if(!validateAddRequest(body)) {
        res.status(400).send({error: "validation error"});
        return;
    }

    usersManager.getUser(body.psid)
        .then(user => {
            debtManager.addDebt(user.id, body.threadId, body.debtType, parseFloat(body.amount))
                .then(debtId => res.status(200).send({
                    debtId
                }));
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

    usersManager.signIn(body.psid)
        .then(user => {
            const debt = debtManager.acceptDebt(req.params.id, user.id);
            if  (!debt) {
                throw new Error('Debt not accepted')
            }
            res.status(200).send({
                debt
            });
        })
        .catch(err => sendErrorMessage(res, err));
});

function validateAcceptRequest(body) {
    return body.psid;
} 

router.route('/threadStatus/:psid/:threadId/:threadType').get((req, res) => {
    usersManager.signIn(req.params.psid, req.params.threadId, req.params.threadType)
        .then(user => 
            usersManager.getUserForThreadId(user.id, req.params.threadId)
                .then(contact => {
                    const balance = debtManager.getThreadBalance(user.id, req.params.threadId);
                    res.status(200).send({
                        userName: user.name,
                        userGender: user.gender,
                        isContactAccepted: !!contact,
                        contactName: contact ? contact.name : '',
                        contactGender: contact ? contact.gender : '',
                        balance
                    });
                })
        )
        .catch(err => sendErrorMessage(res, err));
});

router.route('/status/:psid').get((req, res) => {
    usersManager.signIn(req.params.psid)
        .then(user => usersManager.setNamesInDebtStatus(debtManager.getDebtStatus(user.id)))
        .then(status => {
            res.status(200).send({
                status
            });
        })
        .catch(err => sendErrorMessage(res, err));
});

function sendErrorMessage(res, error) {
    console.error(error)
    res.status(500).send({
        error: error.message || error
    })
}

module.exports = router;