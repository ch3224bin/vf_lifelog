import Vue from 'vue'
import * as firebase from 'firebase/app'
import firebaseConfig from '../firebase.config'

import 'firebase/auth'
// import "firebase/firestore"

// Initialize Firebase
firebase.initializeApp(firebaseConfig)

firebase.auth().onAuthStateChanged(function (user) {
  console.log('onAuthStateChanged')
  console.log(user)
  if (user) {
    var script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = 'https://apis.google.com/js/api.js'
    script.onload = function (e) {
      let gapi = window.gapi
      gapi.client
        .init({
          apiKey: firebaseConfig.apiKey,
          clientId: firebaseConfig.clientID,
          discoveryDocs: firebaseConfig.discoveryDocs,
          scope: firebaseConfig.scope.join(' ')
        })
    }
    document.getElementsByTagName('head')[0].appendChild(script)
  }
})

Vue.prototype.$firebase = firebase
