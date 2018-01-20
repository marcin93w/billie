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

router.route('/*').all(function (req, res, next) {
    if(req.method === 'OPTIONS') {
        next()
        return
    }

    usersManager.signIn(req.headers['x-psid'], req.headers['x-thread-id'], req.headers['x-thread-type'], req.headers['x-signed-request'])
        .then(user => {
            req.user = user
            req.threadId = req.headers['x-thread-id']
            next()
        })
        .catch(err => {
            console.error(err)
            res.status(403).send({})
        })
})

router.route('/threadStatus').get((req, res) => {
    usersManager.getUserForThreadId(req.user.id, req.threadId)
        .then(contact => debtManager.getThreadBalance(req.user.id, req.threadId)
            .then(threadBalance =>
                res.status(200).send({
                    userName: req.user.name,
                    userGender: req.user.gender,
                    isContactAccepted: !!contact,
                    contactName: contact ? contact.name : '',
                    contactGender: contact ? contact.gender : '',
                    threadBalance
                }))
        )
        .catch(err => sendErrorMessage(res, err));
});

router.route('/add').post((req, res) => { 
    usersManager.getUserForThreadId(req.user.id, req.threadId)
        .then(contact => debtManager.addDebt(req.user.id, req.threadId, contact, req.body.debtType, parseFloat(req.body.amount))
        .then(debtId => res.status(200).send({
            debtId
        })))
    .catch(err => sendErrorMessage(res, err));
});

router.route('/cancel/:id').get((req, res) =>
    debtManager.cancelDebt(req.params.id, req.user.id)
        .then(_ => res.status(200).send({}))
        .catch(err => sendErrorMessage(res, err))
);

router.route('/accept/:id').get((req, res) => {
    debtManager.acceptDebt(req.threadId, req.user.id)
        .then(_ => debtManager.getDebt(req.params.id))
        .then(debt => {
            res.status(200).send({
                debt
            })
        })
        .catch(err => sendErrorMessage(res, err));
});

router.route('/status').get((req, res) => {
    debtManager.getDebtStatus(req.user.id)
        .then(status => usersManager.setNamesInDebtStatus(status))
        .then(status => {
            res.status(200).send({
                status
            });
        })
        .catch(err => sendErrorMessage(res, err));
});

function sendErrorMessage(res, error) {
    console.error(error)
    res.status(500).send()
}

module.exports = router;