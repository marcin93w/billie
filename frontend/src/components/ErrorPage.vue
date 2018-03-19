<template>
<div>
  <h4>Coś nie działa, sorry!</h4>
  <h1>:(</h1>
  <h4>Spróbuj jeszcze raz, jeśli problem będzie się powtarzał, napisz do Biliego, na pewno znajdziemy jakieś rozwiązanie ;)</h4>
</div>
</template>

<script>

export default {
    name: 'ErrorPage',
    props: [],
    data () {
        return {
        }
    },
    created () {
    }
}
</script>

<style scoped>
div {
  padding: 20px;
}

h1 {
  color: grey;
}

h4 {
  vertical-align: middle;
}
</style>
