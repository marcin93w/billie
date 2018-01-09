<template>
  <div class="adding-panel">
        <div>
            <button class="button" v-bind:class="[isPayoffButtonValue ? buttonOutline: '' ]" v-on:click="isPayoffButtonValue = false" value=false name="isPayoff" > Pożyczka </button>
            <button class="button" v-bind:class="[!isPayoffButtonValue ? buttonOutline: '' ]" v-on:click="isPayoffButtonValue = true" value=true name="isPayoff" > Spłata </button>
        </div>
        <div>
            <button class="button"  v-bind:class="[isBorrowedButtonValue ? buttonOutline: '' ]" v-on:click="isBorrowedButtonValue = false"  value=false name="isBorrowed">
                <span v-if="isPayoffButtonValue">Ktoś mi oddaje</span>
                <span v-else>Pożyczam Komuś</span>
            </button>
            <button class="button"  v-bind:class="[!isBorrowedButtonValue ? buttonOutline: '' ]" v-on:click="isBorrowedButtonValue = true" value=true name="isBorrowed">
                <span v-if="isPayoffButtonValue">Oddaję komuś</span>
                <span v-else>Pożyczam od kogoś</span>
            </button>
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
import { sendDebtInvite } from '../services/debt-invite-service'
import { addDebt } from '../services/debts-api-service'
import { ensurePermissions } from '../services/fb-permission-service'
import { getContext, requestCloseBrowser } from '../messenger-extensions/messenger-extensions'
import debtTypes from '../utils/debt-types'
import config from '../config'

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
            isPayoffButtonValue: false,
            isBorrowedButtonValue: false,
            buttonOutline: 'button-outline',
            isPayoff: () => this.isPayoffButtonValue !== false,
            isBorrowed: () => this.isBorrowedButtonValue !== false,
            add: () => {
                const debtType = getDebtType(this.isPayoff(), this.isBorrowed())
                ensurePermissions()
                    .then(_ => getContext(config.fbAppId))
                    .then(info => addDebt(info.psid, info.tid, debtType, this.amount))
                    .then(debt => sendDebtInvite(debt.userName, debt.userGender, debt.debtId, debtType, this.amount))
                    .then(isSent => isSent ? requestCloseBrowser() : null)
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