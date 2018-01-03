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

        const intent = entities.Intent && entities.Intent[0].value;
        const person = entities.contact && entities.contact[0].value;
        if (!intent || !person) {
            return sendFallbackMessage();
        }

        if (intent === 'show') {
            const balance = this.debtManager.getBalance(senderPsid, person);
            var text = `You don't have any debts with ${person}.`;
            if (balance > 0) {
                text = `${person} owes you ${balance}.`;
            } else if (balance < 0) {
                text = `You owe ${(-balance)} to ${person}.`
            }

            return this.messenger.send(senderPsid, { text });
        }

        const amount = entities.number && entities.number[0].value;
        if (!amount) {
            return sendFallbackMessage();
        }

        if (intent === 'lent') {
            this.debtManager.addDebt(senderPsid, person, amount);
            return this.messenger.send(senderPsid, {
                "text": `Hi ${senderName}, I saved that ${person} owes you ${amount} now.`
            });
        } else if (intent === 'borrowed') {
            this.debtManager.addDebt(person, senderPsid, amount);
            return this.messenger.send(senderPsid, {
                "text": `Hi ${senderName}, I saved that you owe ${amount} to ${person}.`
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