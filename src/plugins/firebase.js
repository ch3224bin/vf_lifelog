import Vue from 'vue'
import * as firebase from 'firebase/app'
import firebaseConfig from '../firebase.config'

import 'firebase/auth'
// import "firebase/firestore"

// Initialize Firebase
firebase.initializeApp(firebaseConfig)

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    console.log('firebase onAuthStateChanged')
  }
})

Vue.prototype.$firebase = firebase
