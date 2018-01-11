class DebtAssistant {
    
    constructor(messenger, graphApiUser, debtManager) {
        this.messenger = messenger;
        this.graphApiUser = graphApiUser;
        this.debtManager = debtManager;
    }

    handleMessage(senderPsid, receivedMessage) {
        this.processMessage(senderPsid, receivedMessage);
    }

    processMessage(senderPsid, receivedMessage) {
        const messenger = this.messenger;
        
        const entities = receivedMessage.nlp.entities;
        if (!entities) {
            return sendFallbackMessage();
        }
        
        return sendFallbackMessage();

        function sendFallbackMessage() {
            return messenger.sendActionButtons(senderPsid);
        }
    }
}

module.exports = DebtAssistant;