<template>
    <div class="status">
        <table v-if="myDebtDetected">
            <caption>My debts</caption>
            <thead>
                <tr>
                    <th> Name</th>
                    <th> Balance </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="entry in statusMyDebts">
                    <td>{{entry.name}}</td>
                    <td>{{entry.amount}}</td>
                </tr>
            </tbody>
        </table>
        <table v-if="someonesDebtDetected">
            <caption>Other people's debts</caption>
            <thead>
                <tr>
                    <th> Name</th>
                    <th> Balance </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="entry in statusOthersDebts">
                    <td>{{entry.name}}</td>
                    <td>{{entry.amount}}</td>
                </tr>
                <tr> 
                    <th> Sum </th>
                    <td> {{sumBalance}} </td>                    
                </tr>
            </tbody>
        </table>
        <div>
        <button v-on:click="back">Powrót</button>
        </div>
    </div>
    
</template>

<script>

import { getStatus } from '../services/debts-api-service'
import { ensurePermissions } from '../services/fb-permission-service'
import { getContext } from '../messenger-extensions/messenger-extensions'
import config from '../config'

export default {
    name: 'Status',
    data () {
        return {
            myDebtDetected: true,
            someonesDebtDetected: true,
            sumOthersDebts: 0,
            sumMyDebts: 0,
            sumBalance: 0,
            statusMyDebts: [
                {name: 'Lechu', amount: 5},
                {name: 'Marcin', amount: 6},
                {name: 'Broda', amount: 7},
                {name: 'Madzie', amount: 8}
            ],
            statusOthersDebts: [
                {name: 'Lechu', amount: 1},
                {name: 'Marcin', amount: 2},
                {name: 'Broda', amount: 3},
                {name: 'Madzie', amount: 4}
            ],

            back: () => {
                this.$router.push('/')
            }
        }
    },
    created () {
        this.sumMyDebts = this.statusMyDebts
            .map(entry => entry.amount)
            .reduce((sum, current) => sum + current, 0)

        this.sumOthersDebts = this.statusOthersDebts.map(entry => entry.amount).reduce((sum, current) => sum + current, 0)

        this.sumBalance = this.sumOthersDebts - this.sumMyDebts

        ensurePermissions()
            .then(_ => getContext(config.fbAppId))
            .then(info => getStatus(info.psid))
            .then(entry => {
                this.statusMyDebts = entry.status.filter(s => s.amount > 0)
                this.statusOthersDebts = entry.status
                    .filter(s => s.amount < 0)
                    .map(s => Object.assign(s, { amount: -s.amount }))
            })
            .catch(alert)
    }
}
</script>

<style scoped>

.status{
    margin-top: -4rem;
}

caption {
    line-height: 1.6rem;
    font-size: 2.6rem;
    font-weight: bold;
}
</style>