import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    isSignIn: false,
    gapiLoaded: false,
    datePickerLocale: null
  },
  mutations: {
    setUser (state, user) {
      state.user = user
    },
    setSingIn (state, isSignIn) {
      state.isSignIn = isSignIn
    },
    setGapiLoaded (state, gapiLoaded) {
      state.gapiLoaded = gapiLoaded
    },
    setDatePickerLocale (state, datePickerLocale) {
      state.datePickerLocale = datePickerLocale
    }
  },
  actions: {

  }
})
