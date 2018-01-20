import config from '../config'

function createHeaders (context, isPost) {
    let headers = {
        'Accept': 'application/json, text/plain, */*',
        'X-Psid': context.psid,
        'X-Thread-Id': context.tid,
        'X-Thread-Type': context.thread_type,
        'X-Signed-Request': context.signed_request
    }

    if (isPost) {
        headers['Content-Type'] = 'application/json'
    }

    return headers
}

export function addDebt (context, debtType, amount) {
    return fetch(config.apiUrl + '/debts/add', {
        method: 'POST',
        headers: createHeaders(context, true),
        body: JSON.stringify({ debtType, amount })
    })
    .then(handleResponse)
}

export function acceptDebt (context, debtId) {
    return fetch(`${config.apiUrl}/debts/accept/${debtId}`, {
        headers: createHeaders(context)
    })
    .then(handleResponse)
}

export function getThreadStatus (context) {
    return fetch(`${config.apiUrl}/debts/threadStatus`, {
        headers: createHeaders(context)
    })
    .then(handleResponse)
}

export function getStatus (context) {
    return fetch(`${config.apiUrl}/debts/status`, {
        headers: createHeaders(context)
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
