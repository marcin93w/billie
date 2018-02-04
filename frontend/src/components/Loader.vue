<template>
<div v-if="isloading">
<svg id="triangle" width="100px" height="100px" viewBox="-3 -4 39 39">
  <polygon fill="#EFEFEF" stroke="#333333" stroke-width="1" points="16,0 32,32 0,32"></polygon>
</svg></div> 
</template>

<script>

export default {
    name: 'Loader',
    props: ['isloading'],
    data () {
        return {
        }
    },
    created () {
    }
}
</script>

<style scoped>
html, body {
  background-color: #f3f3f3;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

svg {
margin: 10% auto;
  transform-origin: 50% 65%;
}

svg polygon {
  stroke-dasharray: 17;
  animation: dash 2.5s cubic-bezier(0.35, 0.04, 0.63, 0.95) infinite;
}

@keyframes dash {
  to {
    stroke-dashoffset: 136;
  }
}
@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}


</style>
