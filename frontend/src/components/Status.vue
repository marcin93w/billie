<template>
    <div class="status">
        <Loader :isloading="isloading" />
        <div v-if="!isloading">
            <h4>Twoje długi</h4>
            <table class="statusTable">
                <tr v-for="item in items" v-on:click="showDebtHistory(item)">
                    <td class="avatar"><img :src="item.avatarUrl" :alt="item.fullName"></td>
                    <td>{{item.fullName}}</td>
                    <td
                        class="amountCell"
                        v-bind:class="[item.isPositive ? 'text-positive' : 'text-negative' ]">
                        {{item.amount}} zł
                    </td>
                    <td class="details-arrow"><img src="../assets/right-chevron.svg" alt="pokaż szczegóły"
                    /></td>
                </tr>
                <tr class="totalRow">
                    <td />
                    <td>Razem</td>
                    <td
                        class="amountCell"
                        v-bind:class="[isTotalPositive ? 'text-positive' : 'text-negative' ]">
                        {{total}} zł
                    </td>
                    <td />
                </tr>
            </table>
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
import Loader from './Loader.vue'

export default {
    name: 'Status',
    components: {
        'Loader': Loader
    },
    data () {
        return {
            isloading: true,
            items: [],
            total: 0,
            isTotalPositive: true,
            back: () => {
                this.$router.push('/')
            },
            close: () => {
                requestCloseBrowser()
            },
            showDebtHistory: (item) => {
                this.$router.push(`/DebtHistory/${item.userId}/${this.$route.params.allowReturn || ''}`)
            }
        }
    },
    created () {
        ensurePermissions()
            .then(_ => getContext(config.fbAppId))
            .then(info => debtBalancesService.getDebtBalances(info))
            .then(balances => {
                this.isloading = false
                this.items = balances
                    .map(item => ({ ...item,
                        amount: Math.abs(item.amount).toFixed(2),
                        avatarUrl: item.avatarUrl || avatar,
                        isPositive: item.amount >= 0
                    }))
                let totalValue = balances
                    .map(item => item.amount)
                    .reduce((sum, cur) => sum + cur, 0)
                this.isTotalPositive = totalValue >= 0
                this.total = Math.abs(totalValue).toFixed(2)
            })
            .catch(alert)
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
