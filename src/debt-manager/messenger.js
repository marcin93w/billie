const messagesApi = require('../graph-api/messages'),
    config = require('../config');

module.exports = {
    sendWelcome (receiverPsid, name) {
        return messagesApi.sendPost({
            recipient: {
                id: receiverPsid
            },
            message: `Cześć ${name}, jestem botem`
        })
    },
    sendAddDebtInstructions(receiverPsid) {
        return messagesApi.sendPost({
            recipient: {
                id: receiverPsid
            },
            message: { 
                text: `Możesz dodać dług na ekranie konwersacji z dowolną osobą na messengerze, ikonkę menedżera długów znajdziesz w rozszerzeniach.`
            }
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
                        text: 'Co chcesz zrobić?',
                        buttons: [{
                            type: 'web_url',
                            url: `${config.homeUrl}#/Status`,
                            title: 'Zobacz długi',
                            webview_height_ratio: 'tall',
                            messenger_extensions: true
                        }, {
                            type: 'postback',
                            title: 'Dodaj dług',
                            payload: 'ADD_DEBT_INSTRUCTIONS'
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
                        text: `Twój całkowity status długów to: ${totalBalance}`,
                        buttons: [{
                            type: 'web_url',
                            url: `${config.homeUrl}#/Status`,
                            title: 'Zobacz długi',
                            webview_height_ratio: 'tall',
                            messenger_extensions: true
                        }]
                    }
                }
            }
        })
    }
}