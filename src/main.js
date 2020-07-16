import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./plugin/vue-echarts";
import "./plugin/echarts";
import "./plugin/element";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
