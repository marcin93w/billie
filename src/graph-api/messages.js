module.exports = process.env.NODE_ENV === 'development' ? 
    require('./messages.dev.js') : 
    require('./messages.prod.js')