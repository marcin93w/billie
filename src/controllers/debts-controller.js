const 
    express = require('express'),
    router = express.Router(),
    DebtManager = require('../debt-manager/debt-manager.js'),
    DebtsRepository = require('../repository/debts-repository.js').default,
    UsersManager = require('../debt-manager/users-manager.js'),
    UsersRepository = require('../repository/users-repository.js').default,
    threadsRepository = require('../repository/threads-repository.js'),
    DebtBalanceRepository = require('../repository/debt-balances-repository.js').default,
    usersGraphApi = require('../graph-api/user.js'),
    messengerSignedRequestParser = require('../utils/messenger-signed-request-parser'),
    logger = require('../utils/logger');

const debtManager = new DebtManager(new DebtsRepository(), new DebtBalanceRepository(), threadsRepository, new UsersRepository());
const usersManager = new UsersManager(usersGraphApi, new UsersRepository());

router.route('/*').all(function (req, res, next) {
    if(req.method === 'OPTIONS') {
        next()
        return
    }

    logger.trace('HTTP request', { url: req.originalUrl, headers: req.headers, params: req.params, body: req.body });

    const context = messengerSignedRequestParser.parseSignedRequest(req.headers['x-signed-request'])
    
    req.thread = {
        id: context.tid,
        type: context.thread_type
    }

    usersManager.signIn(context.psid)
        .then(user => {
            req.user = user
            next()
        })
        .catch(err => {
            logger.error(err)
            res.status(403).send({})
        })
})

router.route('/threadContext').get((req, res) => { 
    debtManager.getThreadContext(req.user.id, req.thread)
        .then(threadContext =>
            res.status(200).send({
                user: req.user,
                contact: threadContext.contact,
                threadBalance: threadContext.threadBalance
            }))
        .catch(err => sendErrorMessage(res, err));
});

router.route('/add').post((req, res) => { 
    debtManager.addDebt(req.user.id, req.thread, req.body.debtType, parseFloat(req.body.amount), req.body.comment)
        .then(debtId => res.status(200).send({ debtId }))
        .catch(err => sendErrorMessage(res, err));
});

router.route('/remove/:id').get((req, res) =>
    debtManager.removeDebt(req.params.id, req.user.id)
        .then(_ => res.status(200).send({}))
        .catch(err => sendErrorMessage(res, err))
);

router.route('/removeUnaccpeted/:id').get((req, res) =>
    debtManager.removePendingDebt(req.params.id, req.user.id)
        .then(_ => res.status(200).send({}))
        .catch(err => sendErrorMessage(res, err))
);

router.route('/cancel/:id').get((req, res) =>
    debtManager.removeDebt(req.params.id, req.user.id)
        .then(_ => res.status(200).send({}))
        .catch(err => sendErrorMessage(res, err))
);

router.route('/cancelUnaccpeted/:id').get((req, res) =>
    debtManager.removePendingDebt(req.params.id, req.user.id)
        .then(_ => res.status(200).send({}))
        .catch(err => sendErrorMessage(res, err))
);

router.route('/pendingForThread').get((req, res) => { 
    debtManager.getPendingDebtsForThread(req.user.id, req.thread.id)
        .then(threadHistory => res.status(200).send(threadHistory))
        .catch(err => sendErrorMessage(res, err));
});

router.route('/pendingForThread/:id').get((req, res) => { 
    debtManager.getPendingDebtsForThread(req.user.id, req.params.id)
        .then(threadHistory => res.status(200).send(threadHistory))
        .catch(err => sendErrorMessage(res, err));
});

router.route('/status').get((req, res) => {
    debtManager.getUserBalances(req.user.id)
        .then(balances => res.status(200).send(balances))
        .catch(err => sendErrorMessage(res, err));
});

router.route('/userHistory/:id').get((req, res) => {
    debtManager.getDebtsHistory(req.user.id, req.params.id)
        .then(debts => res.status(200).send(debts))
        .catch(err => sendErrorMessage(res, err))
});

function sendErrorMessage(res, error) {
    logger.error(error)
    res.status(500).send()
}

module.exports = router;