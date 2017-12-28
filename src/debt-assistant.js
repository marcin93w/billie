const
    messenger = require('./graph-api/messenger.js'),
    graphApiUser = require('./graph-api/user.js');

module.exports = {
    handleMessage: (senderPsid, receivedMessage) => {
        graphApiUser.fetchName(senderPsid, (error, name) => {
            if(error) {
                console.log(error);
                return;
            }
    
            let entities = receivedMessage.nlp.entities;
            if (entities && 
                    entities.contact && entities.owes && entities.amount_of_money &&
                    entities.contact[0] && entities.amount_of_money[0]) {
                
                const who = entities.contact[0].value,
                    what = entities.owes ? 'owes' : 'unknown',
                    howMuch = entities.amount_of_money[0].value;
    
                response = {
                    "text": `Hi ${name}, I saved that ${who} now owns you ${howMuch} now.`
                }
            } else if (receivedMessage.text) {
                response = {
                    "text": `Hello ${name}, You sent the message: "${receivedMessage.text}".`
                }
            }
            
            messenger.send(senderPsid, response);
        });
    }
};