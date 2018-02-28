<template>
    <div class="debtHistory">
        <Loader :isloading="isloading" />
        <div v-if="!isloading">
            <div class="contact-panel">
                <div class="avatar">
                    <img :src=contact.avatarUrl :alt=contact.name />
                </div>
                <div class="contact-desc">
                    <p v-if="isUnaccpeted">Ten znajomy nie zaakceptował twoich długów</p>
                    <p v-else>
                        <span v-html="getDebtSummaryText()"></span><span v-if="total" class="amount" v-bind:class="[total > 0 ? 'text-positive' : 'text-negative' ]">{{Math.abs(total).toFixed(2)}}&nbsp;zł</span>.
                        <a v-if="isFromThread" @click="$router.push('/')">Chcesz dodać <span v-if="total">spłatę lub </span>nowy dług?</a>
                    </p>
                </div>
            </div>
            <div class="debts-panel">
                <div class="debt-item" v-for="item in items" v-bind:key="item.id">
                    <div class="debt-desc"><span class="date">{{item.dateRelative}}</span> {{getDebtTypeDescription(item.debtType)}}</div>
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
            <button v-if="this.$route.params.id" v-on:click="back">Powrót</button>
            <button v-else v-on:click="back">Zobacz innych znajomych</button>
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

export default {
    name: 'DebtHistory',
    components: {
        Loader: Loader
    },
    data () {
        return {
            items: [],
            total: 0,
            isloading: true,
            isUnaccpeted: false,
            isFromThread: false,
            contact: {
                name: '',
                fullName: '',
                gender: 'male',
                avatarUrl: ''
            },
            getDebtSummaryText: function () {
                if (this.total === 0) {
                    return `<b>${this.contact.fullName}</b> i ty nie macie w tej chwili żadnych długów`
                } else if (this.total < 0) {
                    return `Łącznie <b>${this.contact.fullName}</b> pożyczył${getGenderSuffix(this.contact.gender)} ci `
                } else {
                    return `Łącznie <b>${this.contact.fullName}</b> pożyczył${getGenderSuffix(this.contact.gender)} od ciebie `
                }
            },
            getDebtTypeDescription (debtType) {
                switch (debtType) {
                case debtTypes.LENT: return `${this.contact.name} pożyczył${this.contact.gender !== 'male' ? 'a' : ''} od ciebie`
                case debtTypes.BORROWED: return `${this.contact.name} pożyczył${this.contact.gender !== 'male' ? 'a' : ''} ci`
                case debtTypes.LENT_PAYOFF: return `${this.contact.name} oddał${this.contact.gender !== 'male' ? 'a' : ''}`
                case debtTypes.BORROWED_PAYOFF: return `oddałeś`
                }
            },
            back: () => {
                this.$router.push(`/Status/${this.$route.params.allowReturn || ''}`)
            }
        }
    },
    created () {
        moment.locale('pl')
        ensurePermissions()
            .then(_ => getContext(config.fbAppId))
            .then(context => {
                const unknownContact = {
                    name: 'ktoś',
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
            .catch(handleError)
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
    margin: 0 15px;
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
