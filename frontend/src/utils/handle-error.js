import config from '../config'

export default function handleError (error) {
    console.error(error)
    fetch(config.apiUrl + '/errorHandler', {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(error, Object.getOwnPropertyNames(error))
    })
}
