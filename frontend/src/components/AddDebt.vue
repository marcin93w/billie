<template>
    <div class="adding-panel">
        <div class="action-buttons">
            <button class="button"  
                v-bind:class="[debtType === debtTypes.LENT ? '' : 'button-outline' ]" 
                v-on:click="setDebtType(false, false)"  
                value="0" name="debtActionButton">
                <span>{{lentText}}</span>
            </button>
            <button class="button"  
                v-if="isContactAccepted && balance < 0"
                v-bind:class="[debtType === debtTypes.LENT_PAYOFF || debtType === debtTypes.BORROWED_PAYOFF ? '' : 'button-outline' ]" 
                v-on:click="setDebtType(true)" 
                value="2" name="debtActionButton">
                <span>{{payoffText}}</span>
            </button>
            <div class="avatars-panel">
                <img class="arrow arrow-top" src="../assets/arrow1.png" 
                    v-on:click="setDebtType(false, false)"
                    v-bind:class="[debtType === debtTypes.LENT || debtType === debtTypes.BORROWED_PAYOFF ? 'arrow-active' : 'arrow-inactive' ]" 
                />
                <div class="between-arrows">
                    <div class="avatar avatar-left">
                        <img :src="userAvatarURL" :alt="userName" /> 
                    </div>           
                    <div class="avatar avatar-right">
                        <img :src="contactAvatarURL" :alt="contactName"  /> 
                    </div>
                </div>
                <img class="arrow arrow-bottom" src="../assets/arrow2.png"
                    v-on:click="setDebtType(false, true)" 
                    v-bind:class="[debtType === debtTypes.BORROWED || debtType === debtTypes.LENT_PAYOFF ? 'arrow-active' : 'arrow-inactive' ]"
                />
            </div>
            <button class="button "  
                v-bind:class="[debtType === debtTypes.BORROWED ? '' : 'button-outline' ]" 
                v-on:click="setDebtType(false, true)" 
                value="1" name="debtActionButton">
                <span>{{borrowedText}}</span>
            </button>
            <button class="button"  
                v-if="isContactAccepted && balance > 0"
                v-bind:class="[debtType === debtTypes.LENT_PAYOFF || debtType === debtTypes.BORROWED_PAYOFF ? '' : 'button-outline' ]" 
                v-on:click="setDebtType(true)" 
                value="2" name="debtActionButton">
                <span>{{payoffText}}</span>
            </button>
        </div>
        <div class="amount-panel">
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
import avatar from '../assets/avatar.svg'
import handleError from '../utils/handle-error'

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
    props: ['userName', 'userGender', 'userAvatar', 'showPayoff', 'isContactAccepted',
        'contactName', 'contactGender', 'contactAvatar', 'balance'],
    computed: {
        lentText: function () {
            if (this.isContactAccepted || this.contactName) {
                return `pożycza ode mnie`
            }

            return 'Pożyczam Komuś'
        },
        borrowedText: function () {
            if (this.isContactAccepted || this.contactName) {
                return `pożycza mi`
            }

            return 'Pożyczam od kogoś'
        },
        payoffText: function () {
            if (this.balance < 0) {
                return 'Oddaję'
            } else {
                return `Oddaje mi`
            }
        },
        userAvatarURL: function () {
            return this.userAvatar || avatar
        },
        contactAvatarURL: function () {
            return this.contactAvatar || avatar
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
                        .then(debt => sendDebtInvite(this.isContactAccepted, this.userName, this.userGender, this.debtType, this.amount)
                            .then(isSent => isSent ? requestCloseBrowser() : cancelDebt(context, debt.debtId, !this.isContactAccepted))))
                    .catch(handleError)
            }
        }
    }
}
</script>

<style scoped>
.adding-panel {
    margin-top: 20px;
}

.adding-panel div:not(.between-arrows, .avatar) {
    margin: 20px 10px;
}

.action-buttons {
    margin: 20px auto;
}

.amount-panel {
    margin: 20px auto;
}

#amount, .currency-text {
    width: 50%;
    max-width: 300px;
    text-align: center;
    font-weight: bold;
    font-size: 2rem;
}

.currency-text {
    margin-left: 5px;
}

.avatar {
    width: 45px;
    vertical-align: middle;
    display: inline-block;
    margin: auto 25px;
}

.avatar-left {
    margin-right: 75px;
}

.avatar-right {
    margin-left: 75px;
}

.avatar img {
    border-radius: 50%;
}

.arrow {
    width: 125px;
    margin: auto auto 1.0rem auto;
    display: block;
}

.arrow-top {
    margin-bottom: -5px;
}

.arrow-bottom {
    margin-top: -5px;
}

.arrow-active{
    opacity: 1;
}

.arrow-inactive{
    opacity: 0.2;   
}

.between-arrows{
    display: inline-block;
}
</style>