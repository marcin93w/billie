export function beginShareFlow (message, broadcast) {
    return new Promise((resolve, reject) => {
        window.MessengerExtensions.beginShareFlow(function (shareResponse) {
            resolve(shareResponse)
        }, function (errorCode, errorMessage) {
            reject(errorMessage)
        }, message, broadcast)
    })
}

export function getContext (fbAppId) {
    return new Promise((resolve, reject) => {
        window.MessengerExtensions.getContext(fbAppId,
        function success (threadContext) {
            resolve(threadContext)
        }, function error (err) {
            reject(err)
        })
    })
}

export function requestCloseBrowser () {
    window.MessengerExtensions.requestCloseBrowser()
}
