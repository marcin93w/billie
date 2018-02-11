import Vue from 'vue'
import Router from 'vue-router'
import MainPage from '@/components/MainPage'
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
            path: '/Status/:allowReturn?',
            name: 'Status',
            component: Status
        },
        {
            path: '/DebtHistory/:id/:allowReturn?',
            name: 'DebtHistory',
            component: DebtHistory
        }
    ]
})
