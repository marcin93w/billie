import config from '../config.js'

export function sendDebtInvite (userName, debtId, debtType, amount) {
    let message = {
        'attachment': {
            'type': 'template',
            'payload': {
                'template_type': 'generic',
                'elements': [{
                    'title': `Wisisz ${userName} ${amount} zł ${debtType}`,
                    'subtitle': 'Akceptuj dług aby otrzymać przypomnienie.',
                    'image_url': `${config.homeUrl}assets/logo.png`,
                    'default_action': {
                        'type': 'web_url',
                        'url': `${config.homeUrl}#/acceptDebt/${debtId}`,
                        'messenger_extensions': true,
                        'webview_height_ratio': 'compact'
                    },
                    'buttons': [{
                        'type': 'web_url',
                        'url': `${config.homeUrl}#/acceptDebt/${debtId}`,
                        'title': 'Akceptuj',
                        'messenger_extensions': true,
                        'webview_height_ratio': 'compact'
                    }]
                }]
            }
        }
    }

    return new Promise((resolve, reject) => {
        window.MessengerExtensions.beginShareFlow(function (shareResponse) {
            resolve(shareResponse.is_sent)
        }, function (errorCode, errorMessage) {
            reject(errorMessage)
        }, message, 'current_thread')
    })
}
