const 
    express = require('express'),
    router = express.Router(),
    DebtAssistant = require('../debt-manager/debt-assistant.js'),
    DebtManager = require('../debt-manager/debt-manager.js'),
    debtsRepository = require('../repository/debts-repository.js'),
    UsersManager = require('../debt-manager/users-manager.js'),
    usersRepository = require('../repository/users-repository.js'),
    threadsRepository = require('../repository/threads-repository.js'),
    usersGraphApi = require('../graph-api/user.js'),
    messenger = require('../debt-manager/messenger.js'),
    facebookWebhookValidator = require('../utils/facebook-webhook-validator.js');

const debtManager = new DebtManager(debtsRepository);
const usersManager = new UsersManager(usersGraphApi, usersRepository, threadsRepository);
const debtAssistant = new DebtAssistant(messenger, usersManager, debtManager);

router.route('/').get((req, res) => {
    const challenge = facebookWebhookValidator.validateRequestAndGetChallenge(req);
    if(challenge) {
        console.log('WEBHOOK_VERIFIED');
        res.status(200).send(challenge);
    } else {
        res.sendStatus(403);
    }  
});

router.route('/').post((req, res) => {  
    const body = req.body;

    if(!isFromPageSubscription(body)) {
        res.sendStatus(404);
        return;
    }

    body.entry.forEach(processIncomingEvent);
    res.status(200).send('EVENT_RECEIVED');    
});

function isFromPageSubscription(body) {
    return body.object === 'page';
}

function processIncomingEvent(entry) {
    let webhookEvent = entry.messaging[0];
    console.log(webhookEvent);

    if (webhookEvent.message) {
        debtAssistant.handleMessage(webhookEvent.sender.id, webhookEvent.message);        
    } else if (webhookEvent.postback) {
        switch (webhookEvent.postback.payload) {
            case 'ADD_DEBT_INSTRUCTIONS':
                messenger.sendAddDebtInstructions(webhookEvent.sender.id);
                break;
        }
    }
}

module.exports = router;