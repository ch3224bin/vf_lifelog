<template>
  <v-container grid-list-md>
    <v-layout row wrap fluid align-center justify-center>
      <v-flex xs12 sm10 md8 xl6>
        <v-card>
          <v-card-title primary-title>
            Sign In
          </v-card-title>
          <v-card-actions class="justify-center">
              <v-btn @click="signIn" text outlined>
                <span class="sign-up-text">Sign in with Google</span>
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
    }
  }
}
</script>
