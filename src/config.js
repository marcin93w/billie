module.exports = {
    //FIXME nasty hack to detect PROD environment
    homeUrl: process.env.RDS_HOSTNAME ? 'https://billie.money/' : 'https://messenger-debt-bot.herokuapp.com/'
}