<template>
  <div id="app">
    <div id="nav">
      <router-link to="/histogram">柱状图</router-link> |
      <router-link to="/lineChart">折线图</router-link> |
      <router-link to="/epidemic/column">疫情图——百度</router-link>
    </div>
    <router-view />
  </div>
</template>
