<template>
    <div><add-debt />
    <view-balance v-bind:contact-name="contactName" v-bind:balance="threadBalance" />
    <show-status /></div>
</template>

<script>
import AddDebt from './AddDebt.vue'
import ViewBalance from './ViewBalance.vue'
import ShowStatusButton from './ShowStatusButton.vue'
import { getThreadStatus } from '../services/debts-api-service'
import { ensurePermissions } from '../services/fb-permission-service'
import { getContext } from '../messenger-extensions/messenger-extensions'
import config from '../config'

export default {
    name: 'MainPage',
    components: {
        'add-debt': AddDebt,
        'view-balance': ViewBalance,
        'show-status': ShowStatusButton
    },
    data () {
        return {
            userName: '',
            userGender: '',
            contactName: '',
            contactGender: '',
            threadBalance: 0,
            isContactAccepted: false
        }
    },
    created () {
        ensurePermissions()
            .then(_ => getContext(config.fbAppId))
            .then(info => getThreadStatus(info.psid, info.tid, info.thread_type))
            .then(threadStatus => {
                Object.assign(this, threadStatus)
            })
            .catch(alert)
    }
}
</script>
