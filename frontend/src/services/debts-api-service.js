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

export function getThreadStatus (psid, threadId, threadType) {
    return fetch(`${config.apiUrl}/debts/threadStatus/${psid}/${threadId}/${threadType}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json, text/plain, */*'
        }
    })
    .then(handleResponse)
}

export function getStatus (psid) {
    return fetch(`${config.apiUrl}/debts/status/${psid}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json, text/plain, */*'
        }
    })
    .then(handleResponse)
}

function handleResponse (res) {
    return new Promise((resolve, reject) => {
        if (res.status !== 200) {
            if (res.status === 500) {
                return res.json().then(json => {
                    let message = ''
                    if (json) {
                        message = json.error
                    }
                    return reject(new Error(`HTTP error ${res.status}: ${message}`))
                })
            } else {
                return reject(new Error(`HTTP error ${res.status}`))
            }
        } else {
            return resolve(res.json())
        }
    })
}
