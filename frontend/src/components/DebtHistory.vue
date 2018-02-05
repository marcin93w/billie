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
          <button v-on:click="back">Powrót</button>
        </div>
    </div>
</template>

<script>
import { debtHistory } from '../services/debts-api-service'
import { ensurePermissions } from '../services/fb-permission-service'
import { getContext } from '../messenger-extensions/messenger-extensions'
import config from '../config'
import avatar from '../assets/avatar.svg'
import debtTypes from '../utils/debt-types'
import moment from 'moment'
import Loader from './Loader.vue'

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
                case debtTypes.LENT: return `${this.contactName} pożyczył${this.contactGender !== 'male' ? 'a' : ''}`
                case debtTypes.BORROWED: return `pożyczyłeś`
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
            .then(info => debtHistory(info, this.$route.params.id))
            .then(data => {
                this.isloading = false
                this.items = data.debts.map(item => ({
                    date: moment(item.date).fromNow(),
                    amount: item.amount.toFixed(2),
                    debtType: item.debtType,
                    isPositive: item.debtType === debtTypes.LENT || item.debtType === debtTypes.BORROWED_PAYOFF
                }))

                this.avatarUrl = data.contactAvatar || avatar
                this.contactName = data.contactName
                this.contactFullName = data.contactFullName
                this.contactGender = data.contactGender
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
