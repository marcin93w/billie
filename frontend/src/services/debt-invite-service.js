import config from '../config.js'
import debtTypes from '../utils/debt-types'
import { beginShareFlow } from '../messenger-extensions/messenger-extensions.js'

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

export function sendDebtInvite (isContactAccepted, userName, userGender, debtId, debtType, amount) {
    let element

    if (isContactAccepted) {
        element = {
            title: createInviteText(userName, userGender, debtType, amount),
            subtitle: 'Kliknij aby zobaczyć aktualny status długów.',
            image_url: isPayoff(debtType) ? `${config.homeUrl}assets/paid.png` : `${config.homeUrl}assets/new-debt.png`,
            default_action: {
                type: 'web_url',
                url: `${config.homeUrl}#/Status`,
                messenger_extensions: true,
                webview_height_ratio: 'tall'
            },
            buttons: [{
                type: 'web_url',
                url: `${config.homeUrl}#/Status`,
                title: 'Zobacz długi',
                messenger_extensions: true,
                webview_height_ratio: 'tall'
            }]
        }
    } else {
        element = {
            title: createInviteText(userName, userGender, debtType, amount),
            subtitle: 'Akceptuj aby zapisać dług.',
            image_url: `${config.homeUrl}assets/debt-invite.png`,
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
        }
    }

    let message = {
        attachment: {
            type: 'template',
            payload: {
                template_type: 'generic',
                elements: [element]
            }
        }
    }

    return beginShareFlow(message, 'current_thread')
        .then(resp => resp.is_sent)
}
