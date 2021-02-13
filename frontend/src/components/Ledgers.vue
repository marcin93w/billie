<template>
    <div class="status">
        <loader v-if="isloading" />
        <error-page v-else-if="isError" />
        <div v-else>
            <h4>{{ $t("status.yourDebts") }}</h4>
            <table class="statusTable">
                <tr v-for="item in contacts" v-on:click="showLedger(item)" v-bind:key="item.threadId">
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
                    <td>{{ $t("status.total") }}</td>
                    <td
                        class="amountCell"
                        v-bind:class="[isTotalPositive ? 'text-positive' : 'text-negative' ]">
                        {{total}}&nbsp;zł
                    </td>
                    <td />
                </tr>
            </table>
            <div v-if="contacts.length === 0">
                <p>{{ $t("status.noDebtsYet") }}</p>
            </div>
            <button v-if="$route.params.allowReturn" v-on:click="back">{{ $t("status.back") }}</button>
            <button v-if="!$route.params.allowReturn" v-on:click="close">{{ $t("status.close") }}</button>
        </div>
    </div>
</template>

<script>
import { getUserLedgers } from '../services/debts-api-service'
import { ensurePermissions } from '../services/fb-permission-service'
import { getContext, requestCloseBrowser } from '../messenger-extensions/messenger-extensions'
import config from '../config'
import avatar from '../assets/avatar.svg'
import questionMark from '../assets/question-mark.png'
import Loader from './Loader.vue'
import handleError from '../utils/handle-error'
import ErrorPage from './ErrorPage.vue'

export default {
    name: 'Ledgers',
    components: {
        'loader': Loader,
        'error-page': ErrorPage
    },
    data () {
        return {
            isloading: true,
            isError: false,
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
            showLedger: (item) => {
                this.$router.push(`/Ledger/${item.threadId}/${this.$route.params.allowReturn || ''}`)
            }
        }
    },
    created () {
        ensurePermissions()
            .then(_ => getContext(config.fbAppId))
            .then(context => getUserLedgers(context))
            .then(ledgers => {
                this.isloading = false
                this.contacts = ledgers
                    .map(item => ({ ...item,
                        amount: Math.abs(item.balance).toFixed(2),
                        isPositive: item.balance >= 0,
                        avatarUrl: item.fullName ? (item.avatarUrl || avatar) : questionMark,
                        fullName: item.fullName || this.$t('status.waitingForAcceptance')
                    }))
                    .sort((a, b) => b.amount - a.amount)
                let totalValue = ledgers.map(item => item.balance)
                    .reduce((sum, cur) => sum + cur, 0)
                this.isTotalPositive = totalValue >= 0
                this.total = Math.abs(totalValue).toFixed(2)
            })
            .catch(err => {
                this.isError = true
                this.isloading = false
                handleError(err)
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
    height: 45px;
    width: 45px;
    object-fit: cover;
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
