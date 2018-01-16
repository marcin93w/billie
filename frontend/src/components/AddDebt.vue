<template>
  <div class="adding-panel">
        <div>
            <button class="button" v-bind:class="[isPayoff ? 'button-outline' : '' ]" v-on:click="isPayoff = false" value=false name="isPayoff" > Pożyczka </button>
            <button class="button" v-bind:class="[!isPayoff ? 'button-outline' : '' ]" v-on:click="isPayoff = true" value=true name="isPayoff" > Spłata </button>
        </div>
        <div>
            <button class="button"  v-bind:class="[isBorrowed ? 'button-outline' : '' ]" v-on:click="isBorrowed = false"  value=false name="isBorrowed">
                <span v-if="isPayoff">Ktoś mi oddaje</span>
                <span v-else>Pożyczam Komuś</span>
            </button>
            <button class="button"  v-bind:class="[!isBorrowed ? 'button-outline' : '' ]" v-on:click="isBorrowed = true" value=true name="isBorrowed">
                <span v-if="isPayoff">Oddaję komuś</span>
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
import { addDebt, getThreadStatus } from '../services/debts-api-service'
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
            isPayoff: false,
            isBorrowed: false,
            userName: '',
            userGender: '',
            contactName: '',
            contactGender: '',
            threadBalance: 0,
            isContactAccepted: false,
            add: () => {
                const debtType = getDebtType(this.isPayoff, this.isBorrowed)
                ensurePermissions()
                    .then(_ => getContext(config.fbAppId))
                    .then(info => addDebt(info.psid, info.tid, debtType, this.amount))
                    .then(debt => sendDebtInvite(debt.userName, debt.userGender, debt.debtId, debtType, this.amount))
                    .then(isSent => isSent ? requestCloseBrowser() : null)
                    .catch(alert)
            }
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

<style scoped>
.adding-panel div {
    margin: 20px 10px;
}

#amount{
    width: 50%;
    text-align: center;
    font-weight: bold;
    font-size: 2rem;
}

</style>