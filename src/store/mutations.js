import * as types from "./mutationTypes";

const mutations = {
  [types.SET_MENUS](state, menus) {
    state.menus = menus;
  }
};

export default mutations;
