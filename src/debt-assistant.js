class DebtAssistant {
    
    constructor(messenger, graphApiUser, debtManager) {
        this.messenger = messenger;
        this.graphApiUser = graphApiUser;
        this.debtManager = debtManager;
    }

    handleMessage(senderPsid, receivedMessage) {
        this.graphApiUser.fetchName(senderPsid)
            .then(name => {
                console.log(name);
                this.processMessage(senderPsid, name, receivedMessage);
            })
            .catch(error => {
                console.log(error);
            });
    }

    processMessage(senderPsid, snederName, receivedMessage) {
        const messenger = this.messenger;
        
        const entities = receivedMessage.nlp.entities;
        if (!entities) {
            return sendFallbackMessage();
        }

        const person = entities.contact && entities.contact[0];
        const amount = entities.amount_of_money && entities.amount_of_money[0];
        if (!person || !amount) {
            return sendFallbackMessage();
        }
        
        if(entities.owes) {
            debtManager.addDebt(senderPsid, person, amount);
            return this.messenger.send(senderPsid,{
                "text": `Hi ${name}, I saved that ${who} owes you ${howMuch} now.`
            });
        }
        
        return sendFallbackMessage();

        function sendFallbackMessage() {
            return messenger.send(senderPsid, { 
                'text': `Hello ${snederName}, I can't understand what you're saying, please try again.`});
        }
    }
}

module.exports = DebtAssistant;