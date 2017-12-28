const 
    express = require('express'),
    router = express.Router(),
    request = require('request'),
    messenger = require('./graph-api/messenger.js'),
    graphApiUser = require('./graph-api/user.js'),
    facebookWebhookValidator = require('./facebook-webhook-validator.js');

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

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
    
    let body = req.body;
    
    // Checks this is an event from a page subscription
    if (body.object === 'page') {
    
        // Iterates over each entry - there may be multiple if batched
        body.entry.forEach(function(entry) {
        
        // Gets the body of the webhook event
        let webhook_event = entry.messaging[0];
        console.log(webhook_event);
        
        // Get the sender PSID
        let sender_psid = webhook_event.sender.id;
        console.log('Sender PSID: ' + sender_psid);
        
        // Print NLP response
        let nlp = webhook_event.message.nlp.entities;
        console.log(JSON.stringify(nlp));

        // Check if the event is a message or postback and
        // pass the event to the appropriate handler function
        if (webhook_event.message) {
            handleMessage(sender_psid, webhook_event.message);        
        } else if (webhook_event.postback) {
            // handlePostback(sender_psid, webhook_event.postback);
        }

        });
    
        // Returns a '200 OK' response to all requests
        res.status(200).send('EVENT_RECEIVED');
    } else {
        // Returns a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }
    
    });


// Handles messages events
function handleMessage(sender_psid, received_message) {

    graphApiUser.fetchName(sender_psid, (error, name) => {
        if(error) {
            console.log(error);
            return;
        }

        let entities = received_message.nlp.entities;
        if (entities) {
            let who = entities.contact[0].value;
            let what = entities.owes ? 'owes' : 'unknown';
            let howMuch = entities.amount_of_money[0].value;

            response = {
                "text": `Hi ${name}, I saved that ${who} now owns you ${howMuch} now.`
            }
        } else if (received_message.text) {
            response = {
                "text": `Hello ${name}, You sent the message: "${received_message.text}".`
            }
        }
        
        messenger.send(sender_psid, response);
    });
}

module.exports = router;