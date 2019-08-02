import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    isSignIn: false
  },
  mutations: {
    setUser (state, user) {
      state.user = user
    },
    setSingIn (state, isSignIn) {
      state.isSignIn = isSignIn
    }
  },
  actions: {

  }
})
