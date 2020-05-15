/*
 * @Author: 马永华
 * @Date: 2020-05-13 10:23:57
 * @LastEditors: 马永华
 * @LastEditTime: 2020-05-13 10:28:37
 * @Description: 科瑞的配置
 */
module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ["plugin:vue/essential", "@vue/prettier"],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-irregular-whitespace": "off"
  },
  parserOptions: {
    parser: "babel-eslint"
  }
};
