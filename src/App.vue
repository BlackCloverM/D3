<template>
  <div id="app">
    <div id="nav">
      <router-link to="/demo">demo</router-link> |
      <router-link to="/lineChart">折线图demo</router-link> |
      <router-link to="/histogram">柱状图demo</router-link> |
      <router-link to="/pieChart">饼状图</router-link>
    </div>
    <router-view />
  </div>
</template>
