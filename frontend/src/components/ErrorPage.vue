<template>
<div>
  <h4>Coś nie działa, sorry!</h4>
  <h1>:(</h1>
  <h4>Spróbuj jeszcze raz, jeśli problem będzie się powtarzał, napisz do Billiego, na pewno znajdziemy jakieś rozwiązanie ;)</h4>
  <button onclick="javascript:window.location.href='http://m.me/billiedebts'">Zapytaj o pomoc</button>
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

button {
  margin-top: 40px;
}
</style>
