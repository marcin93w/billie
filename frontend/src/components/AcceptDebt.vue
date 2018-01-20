<template>
  <div class="adding-panel">
        <p>{{message}}</p>
        <button @click="close()">Ok</button>
  </div>
</template>

<script>
import { acceptDebt } from '../services/debts-api-service'
import { getContext, requestCloseBrowser } from '../messenger-extensions/messenger-extensions'
import { ensurePermissions } from '../services/fb-permission-service'
import config from '../config'

export default {
    name: 'AddDebt',
    data () {
        return {
            message: 'Ładowanie...',
            close: () => {
                requestCloseBrowser()
            }
        }
    },
    created () {
        ensurePermissions()
            .then(_ => getContext(config.fbAppId))
            .then(info => acceptDebt(info, this.$route.params.id))
            .then(data => {
                if (data.debt.user2) {
                    this.message = 'Dług został zapisany'
                } else {
                    this.message = 'Dług nie został jeszcze zaakceptoawny'
                }
            })
            .catch(alert)
    }
}
</script>

<style scoped>
</style>
