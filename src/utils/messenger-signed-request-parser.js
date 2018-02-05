module.exports = process.env.NODE_ENV === 'development' ? 
    require('./messenger-signed-request-parser.dev.js') : 
    require('./messenger-signed-request-parser.prod.js')