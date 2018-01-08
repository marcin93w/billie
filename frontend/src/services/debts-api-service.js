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
    return new Promise((resolve, reject) => {
        if (res.status !== 200) {
            return res.json().then(json => {
                let message = ''
                if (json) {
                    message = json.error
                }
                return reject(new Error(`HTTP error ${res.status}: ${message}`))
            })
        } else {
            return resolve(res.json())
        }
    })
}
