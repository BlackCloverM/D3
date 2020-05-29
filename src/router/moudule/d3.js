import LineChart from "views/d3/case/lineChart";
import Histogram from "views/d3/case/histogram/";
import PieChart from "views/d3/case/pieChart/";
import ForceMap from "views/d3/case/forceMap/";
import Tree from "views/d3/case/tree/";
import China from "views/d3/case/mapOfChina/";

export default [
  {
    path: "/",
    name: "d3lineChart",
    component: LineChart
  },
  {
    path: "histogram",
    name: "d3histogram",
    component: Histogram
  },
  {
    path: "pieChart",
    name: "d3pieChart",
    component: PieChart
  },
  {
    path: "forceMap",
    name: "fd3orceMap",
    component: ForceMap
  },
  {
    path: "tree",
    name: "d3tree",
    component: Tree
  },
  {
    path: "china",
    name: "d3china",
    component: China
  }
];
