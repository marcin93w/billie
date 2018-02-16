<template>
    <div>
        <div v-if="hasDebtAlready" class="balance-bar">
            <a @click="showStatus()">{{balanceText}}</a>
        </div>
        <div v-if="hasUnacceptedDebt" class="balance-bar">
            <a @click="showStatus()">Dotychczasowy dług z tą osobą na kwotę {{Math.abs(balance)}}&nbsp;zł nie został jeszcze zaakceptowany!</a>
        </div>
    </div>
</template>

<script>

function getGenderSuffix (userGender) {
    return userGender === 'male' ? '' : 'a'
}

export default {
    name: 'ViewBalance',
    props: ['contactName', 'contactGender', 'balance', 'hasDebtAlready', 'hasUnacceptedDebt'],
    computed: {
        balanceText: function () {
            if (this.balance < 0) {
                return `${this.contactName} pożyczył${getGenderSuffix(this.contactGender)} ci już ${-this.balance}&nbsp;zł`
            } else {
                return `${this.contactName} pożyczył${getGenderSuffix(this.contactGender)} już od ciebie ${this.balance}&nbsp;zł`
            }
        }
    },
    data () {
        return {
            showStatus: () => {
                this.$router.push('Status/allowReturn')
            }
        }
    },
    created () {
    }
}
</script>

<style scoped>
.balance-bar {
    padding: 10px;
    background-color: #9b4dca;
}

.balance-bar a {
    color: white;
    text-decoration: underline;
    cursor: pointer;
}
</style>
