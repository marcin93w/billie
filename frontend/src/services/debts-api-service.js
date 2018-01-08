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
    .then(handleResponse)
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
    .then(handleResponse)
}

function handleResponse (res) {
    if (res.status !== 200) {
        return Promise.reject(new Error(`HTTP error ${res.status}`))
    }
    return res.json()
}
