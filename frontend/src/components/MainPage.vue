<template>
    <div><add-debt />
    <view-balance /></div>
</template>

<script>
import AddDebt from './AddDebt.vue'
import ViewBalance from './ViewBalance.vue'

export default {
    name: 'MainPage',
    components: {
        'add-debt': AddDebt,
        'view-balance': ViewBalance
    },
    data () {
        return {
        }
    }
}
</script>
