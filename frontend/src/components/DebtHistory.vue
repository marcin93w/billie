<template>
    <div class="debtHistory">
        <Loader :isloading="isloading" />
        <div v-if="!isloading">
          <div class="contact-panel">
              <img :src=contact.avatarUrl :alt=contact.name />
              <p>{{contact.fullName}}</p>
          </div>
              <table>
                  <tr v-for="item in items">
                      <td><span class="date">{{item.date}}</span> {{getDebtTypeDescription(item.debtType)}}</td>
                      <td>
                          <span class="amount"
                              v-bind:class="[item.isPositive ? 'text-positive' : 'text-negative' ]">
                              {{item.amount}}&nbsp;zł
                          </span>
                      </td>
                  </tr>
              </table>
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
.contact-panel img {
  display: inline-block;
  height: 45px;
  width: 45px;
  object-fit: cover;
  border-radius: 50%;
}

.debtHistory {
  margin: 25px auto;
  padding: 0 25px;
  max-width: 800px;
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
