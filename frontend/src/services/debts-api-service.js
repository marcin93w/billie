import config from '../config'

export function addDebt (psid, threadId, debtType, amount) {
    return fetch(config.apiUrl + '/debts/add', {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ psid, threadId, debtType, amount })
    })
    .then(res => res.json())
}

export function acceptDebt (psid, debtId) {
    return fetch(`${config.apiUrl}/debts/accept/${debtId}`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ psid })
    })
    .then(res => res.json())
}
