<template>
  <div class="adding-panel">
        <div>
            <input type="radio" value="0" name="isPayoff" v-model="isPayoffRadioValue" /> Pożyczka
            <input type="radio" value="1" name="isPayoff" v-model="isPayoffRadioValue" /> Spłata
        </div>
        <div>
            <input type="radio" value="0" name="isBorrowed" v-model="isBorrowedRadioValue" />
            <span v-if="isPayoff()"> Ktoś mi oddaje</span> 
            <span v-else> Pożyczam od kogoś</span> 
            <input type="radio" value="1" name="isBorrowed" v-model="isBorrowedRadioValue" />
            <span v-if="isPayoff()"> Oddaję komuś</span> 
            <span v-else> Pożyczam komuś</span>
        </div>
        <div>
            <input type="number" id="amount" v-model="amount" />
        </div>
        <div>
            <button @click="add()">Send</button>
        </div>
  </div>
</template>

<script>
import { sendDebtInvite } from '../services/messenger-share-service'
import { addDebt } from '../services/debts-api-service'
import { getConversationInfo, returnToConversation } from '../services/conversation-api-service'
import debtTypes from '../utils/debt-types'

function getDebtType (isPayoff, isBorrowed) {
    if (isPayoff) {
        if (isBorrowed) {
            return debtTypes.BORROWED_PAYOFF
        } else {
            return debtTypes.LENT_PAYOFF
        }
    } else {
        if (isBorrowed) {
            return debtTypes.BORROWED
        } else {
            return debtTypes.LENT
        }
    }
}

export default {
    name: 'AddDebt',
    data () {
        return {
            amount: 10,
            debtTypes,
            isPayoffRadioValue: '0',
            isBorrowedRadioValue: '0',
            isPayoff: () => this.isPayoffRadioValue !== '0',
            isBorrowed: () => this.isBorrowedRadioValue !== '0',
            add: () => {
                const debtType = getDebtType(this.isPayoff(), this.isBorrowed())
                getConversationInfo()
                    .then(info => addDebt(info.psid, info.tid, debtType, this.amount))
                    .then(debt => sendDebtInvite(debt.userName, debt.debtId, debtType, this.amount))
                    .then(isSent => isSent ? returnToConversation() : null)
                    .catch(alert)
            }
        }
    }
}
</script>

<style scoped>
.adding-panel div {
    margin: 20px 10px;
}
</style>
