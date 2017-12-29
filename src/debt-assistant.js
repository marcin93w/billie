class DebtAssistant {
    
    constructor(messenger, graphApiUser, debtManager) {
        this.messenger = messenger;
        this.graphApiUser = graphApiUser;
        this.debtManager = debtManager;
    }

    handleMessage(senderPsid, receivedMessage) {
        this.graphApiUser.fetchName(senderPsid)
            .then(name => {
                this.processMessage(senderPsid, name, receivedMessage);
            })
            .catch(error => {
                console.log(error);
            });
    }

    processMessage(senderPsid, senderName, receivedMessage) {
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
            this.debtManager.addDebt(senderPsid, person, amount);
            return this.messenger.send(senderPsid,{
                "text": `Hi ${senderName}, I saved that ${person} owes you ${amount} now.`
            });
        }
        
        return sendFallbackMessage();

        function sendFallbackMessage() {
            return messenger.send(senderPsid, { 
                'text': `Hello ${senderName}, I can't understand what you're saying, please try again.`});
        }
    }
}

module.exports = DebtAssistant;