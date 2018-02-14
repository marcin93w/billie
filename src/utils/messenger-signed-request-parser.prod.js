const crypto = require('crypto'),
    logger = require('../utils/logger');

module.exports = {
    parseSignedRequest: (hash) => {
        let signed_request = hash.split('.');
        let signature = Buffer.from(signed_request[0].replace('-','+').replace('_', '/'), 'base64').toString('hex');  
        let payload = Buffer.from(signed_request[1], 'base64').toString('ascii');
      
        logger.trace('verifing signed request', payload)

        let expected_signature = crypto.createHmac('sha256', process.env.APP_SECRET)
          .update(signed_request[1])
          .digest('hex');
        
        if (signature !== expected_signature) {
            logger.warn('signed request verification failed', { signature, expected_signature })
            throw new Error('Cannot validate signed request: invalid request signature')
        }
      
        return JSON.parse(payload);
    }
}