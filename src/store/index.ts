import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    currentItem: ""
  },
  getters: {
    getCurrentItem(state) {
      return state.currentItem;
    }
  },
  mutations: {
    SET_CURRENT_ITEM(state, itemId: string) {
      state.currentItem = itemId;
    }
  },
  actions: {
    setCurrentItem({ commit }, itemId: string): void {
      commit("SET_CURRENT_ITEM", itemId);
    }
  },
  modules: {}
});
