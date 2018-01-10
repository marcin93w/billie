<template>
    <div><add-debt />
    <view-balance />
    <show-status /></div>
</template>

<script>
import AddDebt from './AddDebt.vue'
import ViewBalance from './ViewBalance.vue'
import ShowStatusButton from './ShowStatusButton.vue'

export default {
    name: 'MainPage',
    components: {
        'add-debt': AddDebt,
        'view-balance': ViewBalance,
        'show-status': ShowStatusButton
    },
    data () {
        return {
        }
    }
}
</script>
