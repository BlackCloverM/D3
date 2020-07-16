<template>
  <div id="app">
    <div>
      <router-link to="/">demo</router-link> |
      <router-link to="/d3">D3</router-link> |
      <router-link to="/g2">G2</router-link> |
      <router-link to="/echarts">Echarts</router-link> |
      <router-link to="/vue-echarts">Vue-echarts</router-link> |
    </div>
    <Son ref="myref"></Son>
    <router-view></router-view>
  </div>
</template>

<script>
export default {};
</script>

<style type="scss">
#nprogress .bar {
  background: red;
}
</style>
