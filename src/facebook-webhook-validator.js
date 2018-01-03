const VERIFY_TOKEN = "vbhksdjvbhjkalsdvbkjlsat345t634t34t";

module.exports = {
    validateRequestAndGetChallenge(req) {
        const mode = req.query['hub.mode'],
            token = req.query['hub.verify_token'],
            challenge = req.query['hub.challenge'];
    
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            return challenge;
        } else {
            return null;
        }
    }
};