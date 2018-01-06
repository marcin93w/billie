<template>
    <add-debt />
</template>

<script>
import AddDebt from './AddDebt.vue'

export default {
  name: 'MainPage',
  components: {
    'add-debt': AddDebt
  },
  data () {
    return {
    }
  }
}
</script>
