import Vue from 'vue'
import VueGAPI from 'vue-gapi'
import GoogleApiConfig from '../google.api.config'
import store from '../store'

Vue.use(VueGAPI, GoogleApiConfig)

let getProfile = currentUser => {
  let profile = currentUser.getBasicProfile()
  return {
    name: profile.getName(),
    imageUrl: profile.getImageUrl(),
    email: profile.getEmail()
  }
}

let updateSigninStatus = (isSignedIn) => {
  if (isSignedIn) {
    let user = getProfile(Vue.prototype.$gapi.auth2.getAuthInstance().currentUser.get())
    store.commit('setUser', user)
  }
  store.commit('setSingIn', isSignedIn)
  store.commit('setGapiLoaded', true)
}

Vue.prototype.$loadGapi = () => {
  Vue.prototype.$getGapiClient()
    .then(gapi => {
      Vue.prototype.$gapi = gapi
      gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus)
      // Handle the initial sign-in state.
      updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get())
    })
}

Vue.prototype.$loadGapi()
