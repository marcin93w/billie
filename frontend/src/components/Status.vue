<template>
    <div>
        <div>{{status}}</div>
        <div>
        <button v-on:click="back">Powrót</button>
        </div>
    </div>
</template>

<script>

import { getBalance } from '../services/debts-api-service'
import { ensurePermissions } from '../services/fb-permission-service'
import { getContext } from '../messenger-extensions/messenger-extensions'
import config from '../config'

export default {
    name: 'Status',
    data () {
        return {
            status: {
                'adasd': 4,
                'fdsfs': -45,
                'ad': 45
            },
            back: () => {
                this.$router.push('/')
            }
        }
    },
    created () {
        ensurePermissions()
            .then(_ => getContext(config.fbAppId))
            .then(info => getBalance(info.psid))
            .then(data => {
                this.debtUserName = data.userName
                this.balance = data.balance['undefined']
            })
            .catch(alert)
    }
}
</script>

<style scoped>
.adding-panel div {
    margin: 20px 10px;
}
</style>
