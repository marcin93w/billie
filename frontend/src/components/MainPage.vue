<template>
    <div>
        <view-balance 
            v-bind:has-debt-already="hasDebtAlready" 
            v-bind:has-unaccepted-debt="hasUnacceptedDebt" 
            v-bind:contact-name="contactName" 
            v-bind:contact-gender="contactGender" 
            v-bind:balance="threadBalance" />
        <add-debt 
            v-bind:user-name="userName" 
            v-bind:user-gender="userGender" 
            v-bind:user-avatar="userAvatar" 
            v-bind:show-payoff="hasDebtAlready"
            v-bind:is-contact-accepted="isContactAccepted"
            v-bind:contact-name="contactName" 
            v-bind:contact-gender="contactGender" 
            v-bind:contact-avatar="contactAvatar" 
            v-bind:balance="threadBalance" />
    </div>
</template>

<script>
import AddDebt from './AddDebt.vue'
import ViewBalance from './ViewBalance.vue'
import { getThreadStatus } from '../services/debts-api-service'
import { ensurePermissions } from '../services/fb-permission-service'
import { getContext } from '../messenger-extensions/messenger-extensions'
import config from '../config'

export default {
    name: 'MainPage',
    components: {
        'add-debt': AddDebt,
        'view-balance': ViewBalance
    },
    data () {
        return {
            userName: '',
            userGender: '',
            userAvatar: '',
            contactName: '',
            contactGender: '',
            contactAvatar: '',
            isContactAccepted: false,
            threadBalance: 0,
            hasDebtAlready: false,
            hasUnacceptedDebt: false
        }
    },
    created () {
        ensurePermissions()
            .then(_ => getContext(config.fbAppId))
            .then(info => getThreadStatus(info))
            .then(threadStatus => {
                Object.assign(this, threadStatus)
                this.hasDebtAlready = threadStatus.isContactAccepted && threadStatus.threadBalance !== 0
                this.hasUnacceptedDebt = !threadStatus.isContactAccepted && threadStatus.threadBalance !== 0
                this.threadBalance = this.threadBalance.toFixed(2)
            })
            .catch(alert)
    }
}
</script>
