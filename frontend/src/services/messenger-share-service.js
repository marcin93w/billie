import config from '../config.js'
import debtTypes from '../utils/debt-types'

function isPayoff (debtType) {
    return debtType === debtTypes.BORROWED_PAYOFF || debtType === debtTypes.LENT_PAYOFF
}

function getGenderSuffix (userGender) {
    return userGender === 'male' ? '' : 'a'
}

function createInviteText (userName, userGender, debtType, amount) {
    switch (debtType) {
    case debtTypes.BORROWED:
        return `${userName} pożyczył${getGenderSuffix(userGender)} od ciebie ${amount} zł`
    case debtTypes.LENT:
        return `${userName} pożyczył${getGenderSuffix(userGender)} ci ${amount} zł`
    case debtTypes.BORROWED_PAYOFF:
        return `${userName} oddał${getGenderSuffix(userGender)} ci ${amount} zł`
    case debtTypes.LENT_PAYOFF:
        return `${userName} otrzymał${getGenderSuffix(userGender)} od ciebie ${amount} zł`
    }
}

export function sendDebtInvite (userName, userGender, debtId, debtType, amount) {
    let message = {
        attachment: {
            type: 'template',
            payload: {
                template_type: 'generic',
                elements: [{
                    title: createInviteText(userName, userGender, debtType, amount),
                    subtitle: isPayoff(debtType) ? 'Akceptuj aby zapisać spłatę' : 'Akceptuj dług aby otrzymać przypomnienie.',
                    image_url: `${config.homeUrl}assets/logo.png`,
                    default_action: {
                        type: 'web_url',
                        url: `${config.homeUrl}#/acceptDebt/${debtId}`,
                        messenger_extensions: true,
                        webview_height_ratio: 'compact'
                    },
                    buttons: [{
                        type: 'web_url',
                        url: `${config.homeUrl}#/acceptDebt/${debtId}`,
                        title: 'Akceptuj',
                        messenger_extensions: true,
                        webview_height_ratio: 'compact'
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
