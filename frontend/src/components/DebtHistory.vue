<template>
    <div class="debtHistory">
            <table>
                <tr>
                    <td><img :src=avatarUrl :alt=contactName></td>
                    <td>{{contactName}}</td>
                </tr>
                <tr v-for="item in items">
                    <td>{{item.date}}</td>
                    <td 
                        class="amountCell" 
                        v-bind:class="[item.isPositive ? 'text-positive' : 'text-negative' ]">
                        {{item.amount}} zł
                    </td>
                </tr>
            </table>
        <button v-if="$route.params.allowReturn" v-on:click="back">Powrót</button>
    </div>
</template>

<script>

import { debtHistory } from '../services/debts-api-service'
import { ensurePermissions } from '../services/fb-permission-service'
import { getContext } from '../messenger-extensions/messenger-extensions'
import config from '../config'
import avatar from '../assets/avatar.svg'
import debtTypes from '../utils/debt-types'

export default {
    name: 'DebtHistory',
    data () {
        return {
            items: [],
            total: 0,
            isTotalPositive: true,
            avatarUrl: '',
            contactName: '',
            back: () => {
                this.$router.push('/')
            }
        }
    },
    created () {
        ensurePermissions()
            .then(_ => getContext(config.fbAppId))
            .then(info => debtHistory(info, this.$route.params.id))
            .then(data => {
                this.items = data.debts
                    .map(item => ({
                        date: item.date,
                        amount: item.amount,
                        isPositive: item.debtType === debtTypes.LENT || item.debtType === debtTypes.BORROWED_PAYOFF
                    }))
                this.avatarUrl = data.contactAvatar || avatar
                this.contactName = data.contactName
            })
            .catch(alert)
    }
}
</script>

<style scoped>

.debtHistory {
    margin: 25px auto;
    max-width: 400px;
}

.totalRow {
    font-weight: bold;
}

.debtHistory img {
    width: 45px;
    height: 45px;
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
</style>