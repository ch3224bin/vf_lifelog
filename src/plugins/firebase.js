import Vue from 'vue'
import * as firebase from 'firebase/app'
import firebaseConfig from '../firebase.config'
import store from '../store'

import 'firebase/auth'
// import "firebase/firestore"

// Initialize Firebase
firebase.initializeApp(firebaseConfig)

firebase.auth().onAuthStateChanged(async (user) => {
  if (user) {
    store.commit('setUser', user)
    store.commit('setSingIn', true)
    store.comiit('setToken', await user.getIdToken())
  }
  store.commit('setGapiLoaded', true)
})

Vue.prototype.$firebase = firebase
