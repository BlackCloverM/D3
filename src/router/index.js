import Vue from "vue";
import VueRouter from "vue-router";
import Demo from "views/";
import d3 from "./moudule/d3";
import echarts from "./moudule/echarts";
import vueEcharts from "./moudule/vue-echarts";
import g2 from "./moudule/g2";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

Vue.use(VueRouter);

export const routes = [
  {
    path: "/",
    name: "Demo",
    title: "Demo",
    icon: "el-icon-location",
    component: Demo
  },
  d3,
  echarts,
  vueEcharts,
  g2
];

const router = new VueRouter({
  routes
});

router.beforeEach((to, from, next) => {
  NProgress.start();
  next();
});

router.afterEach(() => {
  NProgress.done();
});
// 解决路由被重复点击时报错问题 编程式导航
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};

export default router;
