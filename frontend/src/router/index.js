import Vue from 'vue'
import Router from 'vue-router'
import MainPage from '@/components/MainPage'
import AcceptDebt from '@/components/AcceptDebt'
import Status from '@/components/Status'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'HelloWorld',
            component: MainPage
        },
        {
            path: '/acceptDebt/:id',
            name: 'AcceptDebt',
            component: AcceptDebt
        },
        {
            path: '/Status/',
            name: 'Status',
            component: Status
        }
    ]
})
