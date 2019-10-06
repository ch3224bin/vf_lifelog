<template>
  <v-container grid-list-md>
    <v-layout row wrap fluid align-center justify-center>
      <v-flex xs12 sm10 md8 xl6>
        <v-card>
          <v-card-title primary-title>
            {{ $t('title.signin') }}
          </v-card-title>
          <v-card-actions class="justify-center">
              <v-btn @click="signIn" block text outlined>
                <span class="sign-up-text">{{ $t('msg.signinWithGoogle') }}</span>
              </v-btn>
              <v-btn @click="signIn2" block text outlined>
                <span class="sign-up-text">{{ $t('msg.signinWithGoogle') }}</span>
              </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<style>
.sign-up-text {
    background-image: url(/google-logo.svg);
    background-repeat: no-repeat;
    background-position: left center;
    background-size: 20px 20px;
    clear: right;
    padding: 5px 0 5px 30px;
}
</style>

<script>
export default {
  methods: {
    signIn () {
      this.$gapi.auth2.getAuthInstance().signIn()
        .then(() => {
          this.$router.push('/')
        })
    },
    signIn2 () {
      const provider = new this.$firebase.auth.GoogleAuthProvider()
      provider.addScope('https://www.googleapis.com/auth/calendar.readonly')
      provider.addScope('https://www.googleapis.com/auth/calendar')
      provider.addScope('https://www.googleapis.com/auth/calendar.events.readonly')
      provider.addScope('https://www.googleapis.com/auth/calendar.events')
      this.$firebase.auth().signInWithPopup(provider).then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        // var token = result.credential.accessToken
        // console.log(token)
        console.log(result)
        // The signed-in user info.
        // var user = result.user
        // console.log(user)
        // ...
      })
    }
  }
}
</script>
