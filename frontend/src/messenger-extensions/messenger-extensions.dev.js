export function beginShareFlow (message, broadcast) {
    console.log(`Message to ${broadcast}: ${JSON.stringify(message)}`)
    alert('Message send reqested: ' + message.attachment.payload.elements[0].title)

    return new Promise((resolve, reject) => {
        if (window.__beginShareFlow__return_error) {
            reject(new Error('beginShareFlow error'))
        } else {
            resolve({ is_sent: true })
        }
    })
}

export function getContext (fbAppId) {
    return new Promise((resolve, reject) => {
        if (window.__getContext__return_error) {
            reject(new Error('getContext error'))
        } else {
            resolve({
                thread_type: 'GROUP',
                tid: '1411911565550430',
                psid: '1291641364275530'
            })
        }
    })
}

export function requestCloseBrowser () {
    alert('Close webview requested')
}
