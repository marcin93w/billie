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
                text: `Możesz dodać dług na ekranie konwersacji z dowolną osobą w aplikacji Messengera na iOS lub Android. Ikonę Billiego znajdziesz w rozszerzeniach konwersacji.`
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
                            title: 'Zobaczyć długi',
                            webview_height_ratio: 'tall',
                            messenger_extensions: true
                        }, {
                            type: 'postback',
                            title: 'Dodać dług',
                            payload: 'ADD_DEBT_INSTRUCTIONS'
                        }]
                    }
                }
            }
        })
    },
    sendStatusMessage(receiverPsid, totalBalance) {
        function getTotalBalanceText(balance) {
            if (totalBalance === 0) {
                return 'Nie masz żadnych zaległych długów'
            } else if (totalBalance > 0) {
                return `Twoi znajomi pożyczyli od ciebie ${totalBalance}`
            } else {
                return `Pożyczyłeś od swoich znajomych ${-totalBalance}`
            }
        }
        
        return messagesApi.sendPost({
            recipient: {
                id: receiverPsid
            },
            message: {
                attachment: {
                    type: 'template',
                    payload: {
                        template_type: 'button',
                        text: getTotalBalanceText(totalBalance),
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