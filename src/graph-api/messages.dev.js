module.exports = {
    sendPost(requestBody) {
        console.log(`Sending message: ${requestBody}`)
        return Promise.resolve()
    }
};