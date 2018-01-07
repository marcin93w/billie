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
            message: 'Ładowanie...',
            close: () => {
                returnToConversation()
            }
        }
    },
    created () {
        getConversationInfo()
            .then(info => acceptDebt(info.psid, this.$route.params.id))
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
