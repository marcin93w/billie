export function addDebt (psid, threadId, debtType, amount) {
    return fetch('/debts/add', {
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
    return fetch(`/debts/accept/${debtId}`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ psid })
    })
    .then(res => res.json())
}
