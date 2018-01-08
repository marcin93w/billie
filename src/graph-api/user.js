module.exports = process.env.NODE_ENV === 'development' ? 
    require('./user.dev.js') : 
    require('./user.prod.js')