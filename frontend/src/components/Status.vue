<template>
    <div class="status">
        <Loader :isloading="isloading" />
        <div v-if="!isloading">
            <h4>Twoje długi</h4>
            <table class="statusTable">
                <tr v-for="item in contacts" v-on:click="showDebtHistory(item)">
                    <td class="avatar"><img :src="item.avatarUrl" :alt="item.fullName"></td>
                    <td>{{item.fullName}}</td>
                    <td
                        class="amountCell"
                        v-bind:class="[item.isPositive ? 'text-positive' : 'text-negative' ]">
                        {{item.amount}}&nbsp;zł
                    </td>
                    <td class="details-arrow"><img src="../assets/right-chevron.svg" alt="pokaż szczegóły"
                    /></td>
                </tr>
                <tr v-if="contacts.length > 0" class="totalRow">
                    <td />
                    <td>Razem</td>
                    <td
                        class="amountCell"
                        v-bind:class="[isTotalPositive ? 'text-positive' : 'text-negative' ]">
                        {{total}}&nbsp;zł
                    </td>
                    <td />
                </tr>
            </table>
            <div v-if="contacts.length === 0">
                <p>Nie masz jeszcze żadnych długów</p>
            </div>
            <button v-if="$route.params.allowReturn" v-on:click="back">Powrót</button>
            <button v-if="!$route.params.allowReturn" v-on:click="close">Zamknij</button>
        </div>
    </div>
</template>

<script>

import debtBalancesService from '../services/debt-balances-service'
import { ensurePermissions } from '../services/fb-permission-service'
import { getContext, requestCloseBrowser } from '../messenger-extensions/messenger-extensions'
import config from '../config'
import avatar from '../assets/avatar.svg'
import questionMark from '../assets/question-mark.png'
import Loader from './Loader.vue'
import handleError from '../utils/handle-error'

export default {
    name: 'Status',
    components: {
        'Loader': Loader
    },
    data () {
        return {
            isloading: true,
            contacts: [],
            unaccpeted: [],
            total: 0,
            isTotalPositive: true,
            back: () => {
                this.$router.push('/')
            },
            close: () => {
                requestCloseBrowser()
            },
            showDebtHistory: (item) => {
                const isUnaccepted = !item.userId
                const id = item.userId || item.threadId
                this.$router.push(`/DebtHistory/${id}/${isUnaccepted}/${this.$route.params.allowReturn || ''}`)
            }
        }
    },
    created () {
        ensurePermissions()
            .then(_ => getContext(config.fbAppId))
            .then(info => debtBalancesService.getDebtBalances(info))
            .then(balances => {
                this.isloading = false
                this.contacts = balances.contacts
                    .map(item => ({ ...item,
                        amount: Math.abs(item.amount).toFixed(2),
                        avatarUrl: item.avatarUrl || avatar,
                        isPositive: item.amount >= 0
                    }))
                    .concat(balances.unaccpeted
                        .map(item => ({ ...item,
                            amount: Math.abs(item.amount).toFixed(2),
                            avatarUrl: questionMark,
                            isPositive: item.amount >= 0,
                            fullName: 'Niezaakceptowany'
                        })))
                let totalValue = balances.contacts.map(item => item.amount)
                    .concat(balances.unaccpeted.map(b => b.amount))
                    .reduce((sum, cur) => sum + cur, 0)
                this.isTotalPositive = totalValue >= 0
                this.total = Math.abs(totalValue).toFixed(2)
            })
            .catch(error => {
                handleError(error)
                this.isloading = false
            })
    }
}
</script>

<style scoped>

.status {
    padding: 10px;
}

.statusTable {
    margin: 0 auto 25px auto;
    max-width: 400px;
}

.statusTable tr:not(.totalRow) {
    cursor: pointer;
}

.totalRow {
    font-weight: bold;
}

.avatar img {
    width: 45px;
    margin: auto;
    display: block;
    border-radius: 50%;
}

.amountCell {
    text-align: center;
    font-weight: bold;
}

.text-positive {
    color: green;
}

.text-negative {
    color: darkred;
}

.text-italics {
    font-style: italic;
}

.details-arrow img {
    height: 1em;
    margin: auto;
    display: block;
}
</style>
