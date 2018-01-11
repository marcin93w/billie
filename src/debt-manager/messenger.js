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
                            title: 'Pokaż moje długi',
                            webview_height_ratio: 'tall',
                            messenger_extensions: true
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
                            title: 'Pokaż moje długi',
                            webview_height_ratio: 'tall',
                            messenger_extensions: true
                        }]
                    }
                }
            }
        })
    }
}