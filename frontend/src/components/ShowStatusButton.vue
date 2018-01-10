<template>
  <div class="adding-panel">
        <div>
            <button v-on:click="showStatus">asd</button>
        </div>
  </div>
</template>

<script>

export default {
    name: 'ShowStatusButton',
    data () {
        return {
            showStatus: () => {
                this.$router.push('Status')
            }
        }
    }
}
</script>

<style scoped>
.adding-panel div {
    margin: 20px 10px;
}
</style>
