<template>
    <div class="status">
        <div>
            <table class="statusTable">
                <tr v-for="item in items">
                    <td><img :src="item.avatarUrl" :alt="item.name"></td>
                    <td>{{item.userName}}</td>
                    <td class="amountCell">{{item.amount}} zł</td>
                </tr>
                <tr class="totalRow">
                    <td></td>
                    <td>Razem</td>
                    <td class="amountCell">{{total}} zł</td>
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
            items: [],
            total: 0,
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
                this.total = this.items
                    .map(item => item.amount)
                    .reduce((sum, cur) => sum + cur, 0)
            })
            .catch(alert)
    }
}
</script>

<style scoped>

.statusTable {
    margin: 25px auto;
    max-width: 400px;
}

.totalRow {
    font-weight: bold;
}

.statusTable img {
    width: 45px;
    height: 45px;
    margin: auto;
    display: block;
    border-radius: 50%;
}

.amountCell {
    text-align: center;
}
</style>