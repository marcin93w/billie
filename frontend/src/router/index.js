import Vue from 'vue'
import Router from 'vue-router'
import MainPage from '@/components/MainPage'
import Ledgers from '@/components/Ledgers'
import Ledger from '@/components/Ledger'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'MainPage',
            component: MainPage
        },
        {
            path: '/Ledgers/:allowReturn?',
            name: 'Ledgers',
            component: Ledgers
        },
        {
            path: '/Ledger/:id?/:allowReturn?',
            name: 'Ledger',
            component: Ledger
        }
    ]
})
