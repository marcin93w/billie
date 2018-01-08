module.exports = {
    send(receiverPsid, message) {
        console.log(`Sending message to ${receiverPsid}: ${message}`)
        return Promise.resolve()
    }
};