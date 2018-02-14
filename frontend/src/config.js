export default {
    homeUrl: window.homeUrl || 'https://messenger-debt-bot.herokuapp.com/',
    fbAppId: window.fbAppId || '135139390498529',
    apiUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:1337' : ''
}
