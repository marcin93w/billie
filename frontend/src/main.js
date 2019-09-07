// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueApollo from 'vue-apollo'
import ApolloClient from 'apollo-boost'
import App from './App'
import router from './router'

Vue.config.productionTip = false
Vue.use(VueApollo)

const apolloProvider = new VueApollo({
    defaultClient: new ApolloClient({
        uri: 'http://localhost:3000/graphql'
    })
})

let isStarted = false;

(function (d, s, id) {
    var js
    var fjs = d.getElementsByTagName(s)[0]
    if (d.getElementById(id)) { return }
    js = d.createElement(s); js.id = id
    js.src = '//connect.facebook.com/en_US/messenger.Extensions.js'
    fjs.parentNode.insertBefore(js, fjs)
}(document, 'script', 'Messenger'))

if (process.env.NODE_ENV === 'development') {
    isStarted = true
    // showMarketingWebsite()
    bootStrapApp()
}

window.extAsyncInit = function () {
    /* eslint-disable no-new */
    if (!isStarted) {
        if (window.MessengerExtensions.isInExtension()) {
            bootStrapApp()
        } else {
            showMarketingWebsite()
        }
    }
}

function bootStrapApp () {
    new Vue({
        el: '#app',
        router,
        apolloProvider,
        template: '<App/>',
        components: { App }
    })
};

function showMarketingWebsite () {
    document.getElementById('website').style.display = 'block'
}
