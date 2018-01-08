// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

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
    bootStrapApp()
}

window.extAsyncInit = function () {
    /* eslint-disable no-new */
    if (!isStarted) {
        bootStrapApp()
    }
}

function bootStrapApp () {
    new Vue({
        el: '#app',
        router,
        template: '<App/>',
        components: { App }
    })
};
