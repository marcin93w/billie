<template>
    <div class="status">
        <Loader :isloading="isloading" />

        <div v-if="!isloading">
            <table class="statusTable">
                <tr v-for="item in items" v-on:click="showDebtHistory(item)">
                    <td class="avatar"><img :src="item.avatarUrl" :alt="item.name"></td>
                    <td v-bind:class="[item.isNotAccepted ? 'text-italics' : '' ]">{{item.name}}</td>
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
        </div>
    </div>
</template>

<script>

import { getStatus } from '../services/debts-api-service'
import { ensurePermissions } from '../services/fb-permission-service'
import { getContext } from '../messenger-extensions/messenger-extensions'
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
            showDebtHistory: (item) => {
                if (item.isNotAccepted) {
                    // TODO unaccpeted history
                } else {
                    this.$router.push(`/DebtHistory/${item.userId}`)
                }
            }
        }
    },
    created () {
        ensurePermissions()
            .then(_ => getContext(config.fbAppId))
            .then(info => getStatus(info))
            .then(data => {
                this.isloading = false
                this.items = data.status
                    .map(item => ({
                        userId: item.userId,
                        name: item.userName || 'Niezaakceptowany',
                        amount: Math.abs(item.amount),
                        avatarUrl: item.avatarUrl || avatar,
                        isPositive: item.amount >= 0,
                        isNotAccepted: !item.userName
                    }))
                let totalValue = data.status
                    .map(item => item.amount)
                    .reduce((sum, cur) => sum + cur, 0)
                this.isTotalPositive = totalValue >= 0
                this.total = Math.abs(totalValue)
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
    margin: 25px auto;
    max-width: 400px;
}

.statusTable tr {
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