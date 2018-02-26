<template>
    <div class="debtHistory">
        <Loader :isloading="isloading" />
        <div v-if="!isloading">
            <div class="contact-panel">
                <img :src=contact.avatarUrl :alt=contact.name />
                <p>{{contact.fullName}}</p>
            </div>
            <div>
                <div class="debt-item" v-for="item in items">
                    <div class="debt-desc"><span class="date">{{item.date}}</span> {{getDebtTypeDescription(item.debtType)}}</div>
                    <div class="debt-amount">
                        <span class="amount"
                            v-bind:class="[item.isPositive ? 'text-positive' : 'text-negative' ]">
                            {{item.amount}}&nbsp;zł
                        </span>
                    </div>
                    <div class="debt-arrow">
                        <img src="../assets/right-chevron.svg" alt="pokaż szczegóły" />
                    </div>
                    <div class="debt-details">
                        Lorem ipsum dolor sit amet, lorem ipsum dolor sit amet, lorem ipsum dolor sit amet.
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
            isTotalPositive: true,
            contact: {
                name: '',
                fullName: '',
                gender: 'male',
                avatarUrl: ''
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
                    fullName: 'Ten znajomy nie zaakceptował twoich długów',
                    gender: 'male',
                    avatarUrl: questionMark
                }

                if (this.$route.params.id) {
                    if (this.$route.params.isUnaccpeted === 'true') {
                        return debtBalancesService.getDebtBalanceForUnacceptedThread(context, this.$route.params.id)
                            .then(contactBalance => {
                                this.contact = unknownContact
                                return getPendingDebtsHistory(context, this.$route.params.id)
                            })
                    } else {
                        return debtBalancesService.getDebtBalanceForUser(context, this.$route.params.id).then(contactBalance => {
                            this.contact = contactBalance
                            this.contact.avatarUrl = this.contact.avatarUrl || avatar

                            return debtHistory(context, this.$route.params.id)
                        })
                    }
                } else {
                    return getThreadStatus(context).then(thread => {
                        if (!thread.contact) {
                            this.contact = unknownContact
                            return getPendingDebtsHistory(context)
                        }
                        this.contact = thread.contact
                        this.contact.avatarUrl = this.contact.avatarUrl || avatar

                        return debtHistory(context, thread.contact.id)
                    })
                }
            })
            .then(debts => {
                this.items = debts.map(item => ({
                    date: moment(item.date).fromNow(),
                    amount: item.amount.toFixed(2),
                    debtType: item.debtType,
                    isPositive: item.debtType === debtTypes.LENT || item.debtType === debtTypes.BORROWED_PAYOFF
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

.contact-panel img {
    display: inline-block;
    height: 45px;
    width: 45px;
    object-fit: cover;
    border-radius: 50%;
}

.debt-item {
    border-bottom: 0.1rem solid #e1e1e1;
    display: grid;
    grid-template-columns: auto auto 30px;
    padding: 10px;
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

.debt-arrow {
    grid-column: 3;
    grid-row: 1;
}

.debt-arrow img {
    height: 1em;
    margin: auto;
    vertical-align: middle;
    transform: rotate(90deg);
}

.debt-details {
    display: none;
    grid-column: 1 / 3;
    grid-row: 2;
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
