<template>
    <div class="debtHistory">
        <loader v-if="isloading" />
        <error-page v-else-if="isError" />
        <div v-else>
            <div class="contact-panel">
                <div class="avatar">
                    <img :src=contact.avatarUrl :alt=contact.name />
                </div>
                <div class="contact-desc">
                    <p v-if="isUnaccpeted">{{ $t('debtHistory.thisFirendDidNotAcceptedYourDebts') }}</p>
                    <p v-else>
                        <span v-html="getDebtSummaryText()"></span><span v-if="total" class="amount" v-bind:class="[total > 0 ? 'text-positive' : 'text-negative' ]">{{Math.abs(total).toFixed(2)}}&nbsp;zł</span>.
                        <span v-if="displayBankNumber()">{{ $t('debtHistory.youCanPayOffUsingBankTransfer') }} <a v-on:click="copyBankAccountNumber()">{{contact.bankAccountNumber}}</a>.</span>
                        <span v-if="isFromThread">
                            <a v-if="!displayBankNumber()" @click="$router.push('/')">{{$t('debtHistory.doYouWantToAdd')}} <span v-if="total">{{$t('debtHistory.payOffOr')}} </span>{{$t('debtHistory.newDebt')}}</a>
                            <span v-if="displayBankNumber()">{{$t('debtHistory.youCanAlso')}} <a @click="$router.push('/')">{{$t('debtHistory.addPayOffOrNewDebt')}}</a>.</span>
                        </span>
                    </p>
                </div>
            </div>
            <div class="debts-panel">
                <div class="debt-item" v-for="item in items" v-bind:key="item.id">
                    <div class="debt-desc">
                        <span class="date">{{item.dateRelative}}</span> 
                        <span v-html="getDebtTypeDescription(item.debtType)" />
                    </div>
                    <div class="debt-amount">
                        <span class="amount"
                            v-bind:class="[item.isPositive ? 'text-positive' : 'text-negative' ]">
                            {{item.amount}}&nbsp;zł
                        </span>
                    </div>
                    <div class="debt-details">
                        <span v-show="item.comment" class="debt-comment"><blockquote>{{item.comment}}</blockquote></span>
                    </div>
                </div>
            </div>
            <button v-if="this.$route.params.id" v-on:click="back">{{ $t('debtHistory.back') }}</button>
            <button v-else v-on:click="back">{{ $t('debtHistory.seeOtherFriends') }}</button>
        </div>
    </div>
</template>

<script>
import { debtHistory, getThreadStatus, getPendingDebtsHistory } from '../services/debts-api-service'
import { ensurePermissions } from '../services/fb-permission-service'
import { getContext } from '../messenger-extensions/messenger-extensions'
import config from '../config'
import avatar from '../assets/avatar.svg'
import questionMark from '../assets/question-mark.png'
import debtTypes from '../utils/debt-types'
import moment from 'moment'
import Loader from './Loader.vue'
import debtBalancesService from '../services/debt-balances-service'
import handleError from '../utils/handle-error'
import { getGenderSuffix } from '../utils/utils'
import ErrorPage from './ErrorPage.vue'
import Vue from 'vue'
import VueClipboard from 'vue-clipboard2'

export default {
    name: 'DebtHistory',
    components: {
        'loader': Loader,
        'error-page': ErrorPage
    },
    data () {
        return {
            items: [],
            total: 0,
            isloading: true,
            isError: false,
            isUnaccpeted: false,
            isFromThread: false,
            contact: {
                name: '',
                fullName: '',
                gender: 'male',
                avatarUrl: '',
                bankAccountNumber: null
            },
            displayBankNumber: () => this.total < 0 && this.contact.bankAccountNumber,
            getDebtSummaryText: function () {
                if (this.total === 0) {
                    return `<b>${this.contact.fullName}</b> ${this.$t('debtHistory.andYouHaveNoDebtsAtTheMoment')}`
                } else if (this.total < 0) {
                    return `Łącznie <b>${this.contact.fullName}</b> pożyczył${getGenderSuffix(this.contact.gender)} ci `
                } else {
                    return `Łącznie <b>${this.contact.fullName}</b> pożyczył${getGenderSuffix(this.contact.gender)} od ciebie `
                }
            },
            getDebtTypeDescription (debtType) {
                switch (debtType) {
                case debtTypes.LENT: return `${this.contact.name} pożyczył${this.contact.gender !== 'male' ? 'a' : ''} od&nbsp;ciebie`
                case debtTypes.BORROWED: return `${this.contact.name} pożyczył${this.contact.gender !== 'male' ? 'a' : ''}&nbsp;ci`
                case debtTypes.LENT_PAYOFF: return `${this.contact.name} oddał${this.contact.gender !== 'male' ? 'a' : ''}`
                case debtTypes.BORROWED_PAYOFF: return `oddałeś`
                }
            },
            back: () => {
                this.$router.push(`/Status/${this.$route.params.allowReturn || ''}`)
            },
            copyBankAccountNumber: () => {
                this.$copyText(this.contact.bankAccountNumber)
            }
        }
    },
    created () {
        VueClipboard.config.autoSetContainer = true
        Vue.use(VueClipboard)
        moment.locale('pl')
        ensurePermissions()
            .then(_ => getContext(config.fbAppId))
            .then(context => {
                const unknownContact = {
                    name: this.$t('debtHistory.someone'),
                    fullName: '',
                    gender: 'male',
                    avatarUrl: questionMark
                }

                if (this.$route.params.id) {
                    if (this.$route.params.isUnaccpeted === 'true') {
                        return debtBalancesService.getDebtBalanceForUnacceptedThread(context, this.$route.params.id)
                            .then(contactBalance => {
                                this.total = contactBalance.amount
                                this.contact = unknownContact
                                this.isUnaccpeted = true
                                return getPendingDebtsHistory(context, this.$route.params.id)
                            })
                    } else {
                        return debtBalancesService.getDebtBalanceForUser(context, this.$route.params.id).then(contactBalance => {
                            this.total = contactBalance.amount
                            this.contact = contactBalance
                            this.contact.avatarUrl = this.contact.avatarUrl || avatar

                            return debtHistory(context, this.$route.params.id)
                        })
                    }
                } else {
                    return getThreadStatus(context).then(thread => {
                        this.isFromThread = true
                        this.total = thread.threadBalance
                        if (!thread.contact) {
                            this.contact = unknownContact
                            this.isUnaccpeted = true
                            return getPendingDebtsHistory(context)
                        }
                        this.contact = thread.contact
                        this.contact.avatarUrl = this.contact.avatarUrl || avatar

                        return debtHistory(context, thread.contact.id)
                    })
                }
            })
            .then(debts => {
                this.items = debts.map((item, idx) => ({
                    id: idx,
                    dateRelative: moment(item.date).fromNow(),
                    amount: item.amount.toFixed(2),
                    debtType: item.debtType,
                    isPositive: item.debtType === debtTypes.LENT || item.debtType === debtTypes.BORROWED_PAYOFF,
                    comment: item.comment
                }))
                this.isloading = false
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
.debtHistory {
    margin: 25px auto;
    padding: 0 5px;
    max-width: 600px;
}

.avatar img {
    display: inline-block;
    height: 45px;
    width: 45px;
    object-fit: cover;
    border-radius: 50%;
}

.contact-desc {
    margin: 5px;
}

.debts-panel {
    margin-bottom: 30px;
}

.debt-item {
    border-bottom: 0.1rem solid #e1e1e1;
    display: grid;
    grid-template-columns: 1fr fit-content(200px);
    padding: 10px 0;
    margin: 0 10px;
    align-items:center;
}

.debt-desc {
    grid-column: 1;
    grid-row: 1;
    text-align: left;
}

.debt-amount {
    grid-column: 2;
    grid-row: 1;
    text-align: right;
    margin: 0 5px;
}

.debt-details {
    grid-column: 1 / span 2;
    grid-row: 2;
    text-align: left;
    color: #888;
    font-size: small;
}

.debt-details blockquote {
    margin-top: 5px;
    margin-bottom: 0;
    padding-top: 0;
    padding-bottom: 0;
}

.debt-comment {
    font-style: italic;
}

.date {
    font-style: italic;
}

.amount {
    font-weight: bold;
}

.text-positive {
    color: green;
}

.text-negative {
    color: darkred;
}
</style>
