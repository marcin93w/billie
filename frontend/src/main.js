// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueI18n from 'vue-i18n'
import translations from './translations'

Vue.use(VueI18n)
Vue.config.productionTip = false
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
    const i18n = new VueI18n({
        locale: navigator.language.slice(0, 2),
        messages: translations,
        fallbackLocale: 'pl'
    })

    new Vue({
        el: '#app',
        router,
        template: '<App/>',
        components: { App },
        i18n
    })
};

function showMarketingWebsite () {
    document.getElementById('website').style.display = 'block'
}
