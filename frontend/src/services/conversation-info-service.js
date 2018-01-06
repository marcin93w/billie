import config from '../config.js'

export function getConversationInfo () {
    return new Promise((resolve, reject) => {
        window.MessengerExtensions.getContext(config.fbAppId,
        function success (threadContext) {
            resolve(threadContext)
        }, function error (err) {
            reject(err)
        })
    })
}
