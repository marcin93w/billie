const messagesApi = require('../graph-api/messages'),
    config = require('../config');

module.exports = {
    sendWelcome (receiverPsid, name) {
        return messagesApi.sendPost({
            recipient: {
                id: receiverPsid
            },
            message: `Hi ${name}, I am a bot`
        })
    },
    sendActionButtons (receiverPsid) {
        return messagesApi.sendPost({
            recipient: {
                id: receiverPsid
            },
            message: {
                attachment: {
                    type: 'template',
                    payload: {
                        template_type: 'button',
                        text: 'What do you want to do?',
                        buttons: [{
                            type: 'web_url',
                            url: `${config.homeUrl}#/Status`,
                            title: 'Show debts status'
                        }]
                    }
                }
            }
        })
    },
    sendStatusMessage(receiverPsid, totalBalance) {
        return messagesApi.sendPost({
            recipient: {
                id: receiverPsid
            },
            message: {
                attachment: {
                    type: 'template',
                    payload: {
                        template_type: 'button',
                        text: `Your total balance is ${totalBalance}`,
                        buttons: [{
                            type: 'web_url',
                            url: `${config.homeUrl}#/Status`,
                            title: 'Show debts status'
                        }]
                    }
                }
            }
        })
    }
}