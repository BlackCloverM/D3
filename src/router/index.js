import Vue from "vue";
import VueRouter from "vue-router";
import Demo from "views/";
import D3 from "views/d3";
import d3children from "./moudule/d3";
import G2 from "views/g2";
import g2children from "./moudule/g2";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "demo",
    component: Demo
  },
  {
    path: "/d3",
    component: D3,
    children: d3children
  },
  {
    path: "/g2",
    component: G2,
    children: g2children
  }
];

const router = new VueRouter({
  routes
});

export default router;
