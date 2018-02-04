<template>
    <div class="status">
        <div>
            <table class="statusTable">
                <tr v-for="item in items">
                    <td class="avatar"><img :src="item.avatarUrl" :alt="item.name"></td>
                    <td>{{item.name}}</td>
                    <td 
                        class="amountCell" 
                        v-bind:class="[item.isPositive ? 'text-positive' : 'text-negative' ]">
                        {{item.amount}} zł
                    </td>
                    <td class="details-arrow"><img src="../assets/right-chevron.svg" alt="pokaż szczegóły" /></td>
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

export default {
    name: 'Status',
    data () {
        return {
            items: [],
            total: 0,
            isTotalPositive: true,
            back: () => {
                this.$router.push('/')
            }
        }
    },
    created () {
        ensurePermissions()
            .then(_ => getContext(config.fbAppId))
            .then(info => getStatus(info))
            .then(data => {
                this.items = data.status
                    .map(item => ({
                        name: item.userName,
                        amount: Math.abs(item.amount),
                        avatarUrl: item.avatarUrl || avatar,
                        isPositive: item.amount >= 0
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
    color: green
}

.text-negative {
    color: darkred
}

.details-arrow img {
    height: 1em;
    margin: auto;
    display: block;
}
</style>