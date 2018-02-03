<template>
  <div class="adding-panel">
        <div>
            <button class="button"  
                v-bind:class="[debtType === debtTypes.LENT ? '' : 'button-outline' ]" 
                v-on:click="setDebtType(false, false)"  
                value="0" name="debtActionButton">
                <span>{{lentText}}</span>
            </button>
            <button class="button"  
                v-bind:class="[debtType === debtTypes.BORROWED ? '' : 'button-outline' ]" 
                v-on:click="setDebtType(false, true)" 
                value="1" name="debtActionButton">
                <span>{{borrowedText}}</span>
            </button>
            <button class="button"  
                v-if="isContactAccepted"
                v-bind:class="[debtType === debtTypes.LENT_PAYOFF || debtType === debtTypes.BORROWED_PAYOFF ? '' : 'button-outline' ]" 
                v-on:click="setDebtType(true)" 
                value="2" name="debtActionButton">
                <span>{{payoffText}}</span>
            </button>
        </div>
        <div>
            <input type="number" id="amount" v-model="amount" /> 
            <span class="currency-text">zł</span>
        </div>
        <div>
            <button @click="add()">Dodaj</button>
        </div>
  </div>
</template>

<script>
import { sendDebtInvite } from '../services/debt-invite-service'
import { addDebt, cancelDebt } from '../services/debts-api-service'
import { ensurePermissions } from '../services/fb-permission-service'
import { getContext, requestCloseBrowser } from '../messenger-extensions/messenger-extensions'
import debtTypes from '../utils/debt-types'
import config from '../config'

function getDebtType (isPayoff, isBorrowed, currentAmount) {
    if (isPayoff) {
        if (currentAmount < 0) {
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
    props: ['userName', 'userGender', 'showPayoff', 'isContactAccepted', 'contactName', 'contactGender', 'balance'],
    computed: {
        lentText: function () {
            if (this.isContactAccepted || this.contactName) {
                return `${this.contactName} pożycza ode mnie`
            }

            return 'Pożyczam Komuś'
        },
        borrowedText: function () {
            if (this.isContactAccepted || this.contactName) {
                return `${this.contactName} pożycza mi`
            }

            return 'Pożyczam od kogoś'
        },
        payoffText: function () {
            if (this.balance < 0) {
                return 'Oddaję'
            } else {
                return `${this.contactName} oddaje mi`
            }
        }
    },
    data () {
        return {
            amount: 10,
            debtTypes,
            debtType: debtTypes.LENT,
            setDebtType: (isPayoff, isBorrowed) => {
                this.debtType = getDebtType(isPayoff, isBorrowed, this.balance)
                if (isPayoff) {
                    this.amount = Math.abs(this.balance)
                }
            },
            add: () => {
                ensurePermissions()
                    .then(_ => getContext(config.fbAppId))
                    .then(context => addDebt(context, this.debtType, this.amount)
                        .then(debt => sendDebtInvite(this.isContactAccepted, this.userName, this.userGender, debt.debtId, this.debtType, this.amount)
                            .then(isSent => isSent ? requestCloseBrowser() : cancelDebt(context, debt.debtId))))
                    .catch(alert)
            }
        }
    }
}
</script>

<style scoped>
.adding-panel {
    margin-top: 40px;
}

.adding-panel div {
    margin: 20px 10px;
}

#amount, .currency-text {
    width: 50%;
    text-align: center;
    font-weight: bold;
    font-size: 2rem;
}

.currency-text {
    margin-left: 5px;
}

</style>