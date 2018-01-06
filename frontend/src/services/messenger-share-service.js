import config from '../config.js'

export function sendDebtInvite (userName, debtId, amount) {
    let message = {
        'attachment': {
            'type': 'template',
            'payload': {
                'template_type': 'generic',
                'elements': [{
                    'title': `Wisisz ${userName} ${amount} zł`,
                    'subtitle': 'za piwo',
                    'image_url': `${config.homeUrl}assets/logo.png`,
                    'default_action': {
                        'type': 'web_url',
                        'url': `${config.homeUrl}acceptDebt/${debtId}`
                    },
                    'buttons': [{
                        'type': 'web_url',
                        'url': `${config.homeUrl}acceptDebt/${debtId}`,
                        'title': 'Akceptuj',
                        'messenger_extensions': true,
                        'webview_height_ratio': 'compact'
                    }]
                }]
            }
        }
    }

    window.MessengerExtensions.beginShareFlow(function (shareResponse) {
        if (shareResponse.is_sent) {
            // The user actually did share.
            // Perhaps close the window w/ requestCloseBrowser().
        }
    }, function (errorCode, errorMessage) {
        alert(errorMessage)
    }, message, 'current_thread')
}
