<template>
  <div class="adding-panel">
        <div>
            <span>Twój balans z {{debtUserName}}</span>
        </div>
        <div>
            <span>{{balance}}</span>
        </div>
  </div>
</template>

<script>

import { getBalance } from '../services/debts-api-service'
import { ensurePermissions } from '../services/fb-permission-service'
import { getContext } from '../messenger-extensions/messenger-extensions'
import config from '../config'

export default {
    name: 'ViewBalance',
    data () {
        return {
            debtUserName: '',
            balance: ''
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
