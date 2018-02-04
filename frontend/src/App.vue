<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>
export default {
    name: 'app'
}
</script>

<style>
@import url('milligram/dist/milligram.min.css');
</style>

<style>
body {
    margin: 0;
    background-color: ghostwhite;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
