<template>
  <div class="adding-panel">
        <div>
            <span>Twój balans z {{debtUserName}}</span>
        </div>
        <div>
            <span>{{balance}}</span>
        </div>
  </div>
</template>

<script>

export default {
    name: 'ViewBalance',
    data () {
        return {
            debtUserName: '',
            balance: ''
        }
    },
    created () {
    }
}
</script>

<style scoped>
.adding-panel div {
    margin: 20px 10px;
}
</style>
