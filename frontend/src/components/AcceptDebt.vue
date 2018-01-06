<template>
  <div class="adding-panel">
        <p>{{message}}</p>
        <button @click="close()">Ok</button>
  </div>
</template>

<script>
import { acceptDebt } from '../services/debts-api-service'
import { getConversationInfo, returnToConversation } from '../services/conversation-api-service'

export default {
    name: 'AddDebt',
    data () {
        return {
            message: 'Accepting debt...',
            close: () => {
                returnToConversation()
            }
        }
    },
    created () {
        getConversationInfo()
            .then(info => acceptDebt(info.psid, this.$route.params.id))
            .then(_ => { this.message = 'Debt has been accepted' })
            .catch(alert)
    }
}
</script>

<style scoped>
</style>
