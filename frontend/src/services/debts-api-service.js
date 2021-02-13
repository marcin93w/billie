import config from '../config'

function createHeaders (context, isPost) {
    let headers = {
        'Accept': 'application/json, text/plain, */*',
        'X-Signed-Request': context.signed_request
    }

    if (isPost) {
        headers['Content-Type'] = 'application/json'
    }

    return headers
}

export function addDebt (context, type, amount, comment) {
    return fetch(config.apiUrl + 'add-debt', {
        method: 'POST',
        headers: createHeaders(context, true),
        body: JSON.stringify({ type, amount, comment })
    })
    .then(handleResponse)
}

export function cancelDebt (context, debtId, isUnaccepted) {
    return fetch(`${config.apiUrl}/debts/remove${isUnaccepted ? 'Unaccpeted' : ''}/${debtId}`, {
        headers: createHeaders(context)
    })
    .then(handleResponse)
}

export function getLedgerInfo (context) {
    return fetch(`${config.apiUrl}ledger`, {
        headers: createHeaders(context)
    })
    .then(handleResponse)
}

export function getUserLedgers (context) {
    return fetch(`${config.apiUrl}ledgers`, {
        headers: createHeaders(context)
    })
    .then(handleResponse)
}

export function getLedgerByThreadId (context, threadId) {
    return fetch(`${config.apiUrl}ledger/${threadId}`, {
        headers: createHeaders(context)
    })
    .then(handleResponse)
}

function handleResponse (res) {
    return new Promise((resolve, reject) => {
        if (res.status !== 200 && res.status !== 201) {
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
