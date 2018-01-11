<template>
    <div class="status">
        <table v-if="myDebtDetected">
            <caption>My debts</caption>
            <thead>
                <tr>
                    <th v-for="header in tableHeader">{{header}}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="data in status">
                    <td>{{data.name}}</td>
                    <td>{{data.amount}}</td>
                </tr>
            </tbody>
        </table>
        <table v-if="someonesDebtDetected">
            <caption>Other people's debts</caption>
            <thead>
                <tr>
                    <th v-for="header in tableHeader">{{header}}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="data in status">
                    <td>{{data.name}}</td>
                    <td>{{data.amount}}</td>
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
            tableHeader: ['Name', 'Balance'],
            status: [
                    {name: 'Marcin', amount: -34},
                    {name: 'Leszek', amount: 34},
                    {name: 'Trututu', amount: -412}],
            back: () => {
                this.$router.push('/')
            }
        }
    },
    created () {
        ensurePermissions()
            .then(_ => getContext(config.fbAppId))
            .then(info => getStatus(info.psid))
            .then(data => {
                this.debtUserName = data.userName
                this.balance = data.status
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
