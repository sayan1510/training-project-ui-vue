import Vue from "vue";
import Vuex from "vuex"; // vuex is used for globally use of variables in all vue file
Vue.use(Vuex);

let store = new Vuex.Store({
  state: {
    userData: {},
  },
  getters: {
    showUser: (state) => {
      return state.userData;
    },
  },
  mutations: {
    updateData(state, n) {
      state.userData = n;
    },
  },
});
store.subscribe((mutation, state) => {
  //subscribe is to be used for store localstorage its a function

  localStorage.setItem("user", JSON.stringify(state.userData)); //stringify()The JSON.stringify() method converts a JavaScript object or value to a JSON string,

});
export default store;
