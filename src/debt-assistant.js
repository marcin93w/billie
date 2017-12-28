class DebtAssistant {
    
    constructor(messenger, graphApiUser) {
        this.messenger = messenger;
        this.graphApiUser = graphApiUser;
    }

    handleMessage(senderPsid, receivedMessage) {
        this.graphApiUser.fetchName(senderPsid)
            .then(name => {
                let response = null;
                const entities = receivedMessage.nlp.entities;
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
                
                return this.messenger.send(senderPsid, response);
            })
            .catch(error => {
                console.log(error);
            });
    }
}

module.exports = DebtAssistant;