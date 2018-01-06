<template>
  <div class="adding-panel">
        <input type="number" id="amount" v-model="amount" />
        <button @click="add()">Send</button>
  </div>
</template>

<script>
import { sendDebtInvite } from '../services/messenger-share-service'
import { addDebt } from '../services/debts-api-service'
import { getConversationInfo, returnToConversation } from '../services/conversation-api-service'

export default {
    name: 'AddDebt',
    data () {
        return {
            amount: 10,
            add: () => {
                getConversationInfo()
                    .then(info => addDebt(info.psid, info.tid, 0, this.amount))
                    .then(debt => sendDebtInvite(debt.userName, debt.debtId, this.amount))
                    .then(_ => returnToConversation())
                    .catch(alert)
            }
        }
    }
}
</script>

<style scoped>
</style>
