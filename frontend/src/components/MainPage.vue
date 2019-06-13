<template>
    <div>
        <div class="group" v-if="threadType==='GROUP'">
            <h4>{{$t('mainPage.groupConversationsNotAllowed')}}</h4>
        </div>
        <div class="single" v-else>
            <loader v-if="isloading" />
            <error-page v-else-if="isError" />
            <div v-else>
                <view-balance
                    v-bind:has-debt-already="hasDebtAlready"
                    v-bind:has-unaccepted-debt="hasUnacceptedDebt"
                    v-bind:contact-name="contact && contact.name"
                    v-bind:contact-gender="contact && contact.gender"
                    v-bind:balance="threadBalance" />
                <add-debt
                    v-bind:user-name="user.name"
                    v-bind:user-gender="user.gender"
                    v-bind:user-avatar="user.avatarUrl"
                    v-bind:show-payoff="hasDebtAlready"
                    v-bind:is-contact-accepted="!!contact"
                    v-bind:contact-name="contact && contact.name"
                    v-bind:contact-gender="contact && contact.gender"
                    v-bind:contact-avatar="contact && contact.avatarUrl"
                    v-bind:balance="threadBalance" />
            </div>
        </div>
  </div>
</template>

<script>
import AddDebt from './AddDebt.vue'
import ViewBalance from './ViewBalance.vue'
import Loader from './Loader.vue'
import { getThreadStatus } from '../services/debts-api-service'
import { ensurePermissions } from '../services/fb-permission-service'
import { getContext } from '../messenger-extensions/messenger-extensions'
import config from '../config'
import handleError from '../utils/handle-error'
import ErrorPage from './ErrorPage.vue'

export default {
    name: 'MainPage',
    components: {
        'add-debt': AddDebt,
        'view-balance': ViewBalance,
        'loader': Loader,
        'error-page': ErrorPage
    },
    data () {
        return {
            user: null,
            contact: null,
            threadBalance: 0,
            hasDebtAlready: false,
            hasUnacceptedDebt: false,
            isloading: true,
            isError: false,
            threadType: ''
        }
    },
    created () {
        ensurePermissions()
            .then(_ => getContext(config.fbAppId))
            .then(context => {
                this.threadType = context.thread_type
                return getThreadStatus(context)
            })
            .then(threadStatus => {
                Object.assign(this, threadStatus)
                this.hasDebtAlready = threadStatus.contact && threadStatus.threadBalance !== 0
                this.hasUnacceptedDebt = !threadStatus.contact && threadStatus.threadBalance !== 0
                this.threadBalance = this.threadBalance.toFixed(2)
                this.isloading = false
            })
            .catch(err => {
                this.isError = true
                this.isloading = false
                handleError(err)
            })
    }
}
</script>

<style>
.group{
  margin: 100px 15px 0 15px;
}
.group h4 {
  vertical-align: middle;
}
</style>
