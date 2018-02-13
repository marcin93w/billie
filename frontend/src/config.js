export default {
    // FIXME nasty hack to detect PROD environment
    homeUrl: process.env.RDS_HOSTNAME ? 'https://billie.money/' : 'https://messenger-debt-bot.herokuapp.com/',
    fbAppId: process.env.RDS_HOSTNAME ? '970214263126821' : '135139390498529',
    apiUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:1337' : ''
}
