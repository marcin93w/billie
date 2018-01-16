<template>
  <div class="adding-panel">
        <div>
            <span>Twój balans z {{contactName}}</span>
        </div>
        <div>
            <span>{{balance}}</span>
        </div>
  </div>
</template>

<script>

export default {
    name: 'ViewBalance',
    props: ['contactName', 'balance'],
    data () {
        return {
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
