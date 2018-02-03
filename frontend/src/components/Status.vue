<template>
    <div class="status">
        <div>
            <table class="statusTable">
                <tr v-for="item in items">
                    <td><img :src="item.avatarUrl" alt=""></td>
                    <td>{{item.userName}}</td>
                    <td class="amountCell">{{item.amount}}</td>
                </tr>
                <tr class="summaryRaw">
                    <td><img src="https://openparlyzw.files.wordpress.com/2016/10/report-icon.png?w=368&h=368&crop=1" alt=""></td>
                    <td>Total</td>
                    <td class="amountCell">{{summary}}</td>
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

export default {
    name: 'Status',
    data () {
        return {
            myDebtDetected: true,
            someonesDebtDetected: true,
            items: [],
            summary: 0,
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
                for (var i in this.items) {
                        this.summary=this.summary + this.items[i].amount
                }    
            })
            .catch(alert)
    }
}
</script>

<style scoped>
caption {
    line-height: 1.6rem;
    font-size: 2.6rem;
    font-weight: bold;
}

.status {
    background-color: azure;
    font-weight: bolder;
    font-style: oblique;
    color: black;

}

.statusTable {
border-width: 40px;
background-color: azure;
margin: 25px auto;
max-width: 400px;

}

.summaryRaw {
    font-style: inherit;
    font-size: xx-large;
}

.statusTable img {
    width: 45px;
    height: 45px;
    text-align: center;
    vertical-align: middle;
    margin-left: 25px;
}

.amountCell {
    text-align: center;
}
</style>