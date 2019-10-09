import Vue from 'vue'
import GoogleApiConfig from '../google.api.config'
import store from '../store'

let getProfile = currentUser => {
  let profile = currentUser.getBasicProfile()
  return {
    name: profile.getName(),
    imageUrl: profile.getImageUrl(),
    email: profile.getEmail()
  }
}

let updateSigninStatus = async (isSignedIn) => {
  if (isSignedIn) {
    console.log('updateSigninStatus')
    const googleAuth = Vue.prototype.$gapi.auth2.getAuthInstance()
    const credential = Vue.prototype.$firebase.auth.GoogleAuthProvider.credential(null, googleAuth.currentUser.get().Zi.access_token)
    await Vue.prototype.$firebase.auth().signInWithCredential(credential)
    let user = getProfile(googleAuth.currentUser.get())
    store.commit('setUser', user)
  }
  store.commit('setSingIn', isSignedIn)
  store.commit('setGapiLoaded', true)
}

var script = document.createElement('script')
script.type = 'text/javascript'
script.src = 'https://apis.google.com/js/api.js'
script.onload = (e) => {
  let gapi = window.gapi
  gapi.load('client:auth2', () => {
    gapi.client.init({
      apiKey: GoogleApiConfig.apiKey,
      clientId: GoogleApiConfig.clientId,
      discoveryDocs: GoogleApiConfig.discoveryDocs,
      scope: GoogleApiConfig.scope
    }).then(() => {
      gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus)
      // // Handle the initial sign-in state.
      updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get())
    })
  })
  Vue.prototype.$gapi = gapi
}
// Add to the document
document.getElementsByTagName('head')[0].appendChild(script)
