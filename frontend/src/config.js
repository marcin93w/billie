export default {
    homeUrl: process.env.NODE_ENV === 'production' ? 'https://billie.money/' : 'https://messenger-debt-bot.herokuapp.com/',
    fbAppId: process.env.NODE_ENV === 'production' ? '970214263126821' : '135139390498529',
    apiUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:1337' : ''
}
