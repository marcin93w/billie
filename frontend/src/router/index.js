import Vue from 'vue'
import Router from 'vue-router'
import MainPage from '@/components/MainPage'
import AcceptDebt from '@/components/AcceptDebt'
import Status from '@/components/Status'
import DebtHistory from '@/components/DebtHistory'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'MainPage',
            component: MainPage
        },
        {
            path: '/acceptDebt/:id',
            name: 'AcceptDebt',
            component: AcceptDebt
        },
        {
            path: '/Status/:allowReturn?',
            name: 'Status',
            component: Status
        },
        {
            path: '/DebtHistory/:id',
            name: 'DebtHistory',
            component: DebtHistory
        }
    ]
})
