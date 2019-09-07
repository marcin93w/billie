<template>
<div>
  <h4>{{$t('errorPage.somethingIsBroken')}}</h4>
  <h1>:(</h1>
  <h4>{{$t('errorPage.pleaseTryAgain')}}</h4>
  <button onclick="javascript:window.location.href='http://m.me/billiedebts'">{{$t('errorPage.askForHelp')}}</button>
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
