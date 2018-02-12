class Logger {
    info(type, data) {
        console.log(data ? `${type}: ${JSON.stringify(data)}` : type)
    }
    trace(type, data) {
        console.log(data ? `${type}: ${JSON.stringify(data)}` : type)
    }
    warn(type, data) {
        console.log(data ? `${type}: ${JSON.stringify(data)}` : type)
    }
    error(error) {
        console.error(error)
    }
}

module.exports = new Logger()