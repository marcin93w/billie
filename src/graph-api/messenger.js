module.exports = process.env.NODE_ENV === 'development' ? 
    require('./messenger.dev.js') : 
    require('./messenger.prod.js')