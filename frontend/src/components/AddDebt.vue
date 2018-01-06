<template>
  <div class="adding-panel">
        <input type="number" id="amount" v-model="amount" />
        <button @click="add()">Send</button>
  </div>
</template>

<script>
import { sendDebtInvite } from '../services/messenger-share-service'

export default {
    name: 'AddDebt',
    data () {
        return {
            amount: 10,
            add: () => {
                sendDebtInvite(this.amount)
            }
        }
    }
}
</script>

<style scoped>
</style>
