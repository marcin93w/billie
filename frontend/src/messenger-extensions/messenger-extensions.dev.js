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
                thread_type: 'SINGLE',
                tid: '1411911565550431',
                psid: '1291641364275532',
                signed_request: '5f8i9XXH2hEaykXHKFvu-E5Nr6QRqN002JO7yl-w_9o.eyJhbGdvcml0aG0iOiJITUFDLVNIQTI1NiIsImlzc3VlZF9hdCI6MTUwNDA0NjM4MCwicGFnZV9pZCI6NjgyNDk4MTcxOTQzMTY1LCJwc2lkIjoiMTI1NDQ1OTE1NDY4MjkxOSIsInRocmVhZF90eXBlIjoiVVNFUl9UT19QQUdFIiwidGlkIjoiMTI1NDQ1OTE1NDY4MjkxOSJ9'
            })
        }
    })
}

export function requestCloseBrowser () {
    alert('Close webview requested')
}

export function askPermission (permissionName) {
    return Promise.resolve()
}

export function getGrantedPermissions () {
    return Promise.resolve({
        permissions: [
            'user_profile',
            'user_messaging']
    })
}
