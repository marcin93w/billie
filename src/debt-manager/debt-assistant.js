class DebtAssistant {
    
    constructor(messenger, usersManager, debtManager) {
        this.messenger = messenger;
        this.usersManager = usersManager;
        this.debtManager = debtManager;
    }

    handleMessage(senderPsid, receivedMessage) {
        this.usersManager.signIn(senderPsid)
            .then(user => this.processMessage(senderPsid, user, receivedMessage))
    }

    processMessage(senderPsid, user, receivedMessage) {
        const messenger = this.messenger;
        
        const entities = receivedMessage.nlp.entities;
        if (!entities) {
            return sendFallbackMessage();
        }

        const intent = entities.Intent && entities.Intent[0].value;
        if (!intent) {
            return sendFallbackMessage();
        }

        if (intent === 'show') {
            return this.debtManager.getDebtTotalBalance(user.id)
                .then(balance => this.messenger.sendStatusMessage(senderPsid, balance))
        }

        return sendFallbackMessage();

        function sendFallbackMessage() {
            return messenger.sendActionButtons(senderPsid);
        }
    }
}

module.exports = DebtAssistant;