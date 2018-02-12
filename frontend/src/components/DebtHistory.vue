<template>
    <div class="debtHistory">
        <Loader :isloading="isloading" />
        <div v-if="!isloading">
          <div class="contact-panel">
              <img :src=avatarUrl :alt=contactName />
              <p>{{contactFullName}}</p>
          </div>
              <table>
                  <tr v-for="item in items">
                      <td><span class="date">{{item.date}}</span> {{getDebtTypeDescription(item.debtType)}}</td>
                      <td>
                          <span class="amount"
                              v-bind:class="[item.isPositive ? 'text-positive' : 'text-negative' ]">
                              {{item.amount}} zł
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
import debtTypes from '../utils/debt-types'
import moment from 'moment'
import Loader from './Loader.vue'
import debtBalancesService from '../services/debt-balances-service'

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
            avatarUrl: '',
            contactFullName: '',
            contactName: '',
            contactGender: 'male',
            getDebtTypeDescription (debtType) {
                switch (debtType) {
                case debtTypes.LENT: return `${this.contactName} pożyczył${this.contactGender !== 'male' ? 'a' : ''} od ciebie`
                case debtTypes.BORROWED: return `${this.contactName} pożyczył${this.contactGender !== 'male' ? 'a' : ''} ci`
                case debtTypes.LENT_PAYOFF: return `${this.contactName} oddał${this.contactGender !== 'male' ? 'a' : ''}`
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
                if (this.$route.params.id) {
                    return debtBalancesService.getDebtBalanceForUser(context, this.$route.params.id).then(contactBalance => {
                        this.avatarUrl = contactBalance.avatarUrl || avatar
                        this.contactName = contactBalance.name
                        this.contactFullName = contactBalance.fullName
                        this.contactGender = contactBalance.gender

                        return debtHistory(context, this.$route.params.id)
                    })
                } else {
                    return getThreadStatus(context).then(thread => {
                        if (!thread.contact) {
                            this.avatarUrl = avatar
                            this.contactFullName = 'Ten znajomy nie zaakceptował twoich długów'
                            this.contactName = 'ktoś'

                            return getPendingDebtsHistory(context)
                        }

                        this.avatarUrl = thread.contact.avatarUrl || avatar
                        this.contactName = thread.contact.name
                        this.contactFullName = thread.contact.fullName
                        this.contactGender = thread.contact.gender

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
            .catch(alert)
    }
}
</script>

<style scoped>
.contact-panel img {
  display: inline-block;
  width: 45px;
  border-radius: 50%;
}

.debtHistory {
  margin: 25px auto;
  padding: 0 25px;
  max-width: 400px;
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
