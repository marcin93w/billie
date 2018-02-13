const logger = require('../utils/logger');

class DebtAssistant {
    
    constructor(messenger, usersManager, debtManager) {
        this.messenger = messenger;
        this.usersManager = usersManager;
        this.debtManager = debtManager;
    }

    handleMessage(senderPsid, receivedMessage) {
        this.usersManager.signIn(senderPsid)
            .then(user => this.processMessage(senderPsid, user, receivedMessage))
            .catch(logger.error)
    }

    processMessage(senderPsid, user, receivedMessage) {
        const messenger = this.messenger;
        
        const entities = receivedMessage.nlp.entities;
        if (!entities) {
            logger.trace('Sending fallback message, did not received NLP data', receivedMessage)
            return sendFallbackMessage();
        }

        const intent = entities.Intent && entities.Intent[0].value;
        if (!intent) {
            logger.trace('Sending fallback message, did not understood intent', entities)
            return sendFallbackMessage();
        }

        if (intent === 'show') {
            logger.trace('Sending balance message to user', user)
            return this.debtManager.getTotalBalance(user.id)
                .then(balance => this.messenger.sendStatusMessage(senderPsid, balance))
        }

        logger.warn('Sending fallback message, unknown intent', intent)
        return sendFallbackMessage();

        function sendFallbackMessage() {
            return messenger.sendActionButtons(senderPsid);
        }
    }
}

module.exports = DebtAssistant;