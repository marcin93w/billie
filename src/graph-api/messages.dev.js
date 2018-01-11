module.exports = {
    sendPost(requestBody) {
        console.log(`Sending message: ${JSON.stringify(requestBody)}`)
        return Promise.resolve()
    }
};