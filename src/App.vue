<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      absolute
      temporary
    >
      <v-list
        dense
        nav
      >
        <v-list-item
          v-for="item in menus"
          :key="item.title"
          link
          :to="item.to"
        >
          <v-list-item-content>
            <v-list-item-title v-text="item.title" class="subtitle-1"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app color="lime">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title class="headline text-uppercase">
        <span>LifeLog</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-menu offset-y v-if="$store.state.user">
          <template v-slot:activator="{ on }">
            <v-btn
              icon
              v-on="on"
            >
              <v-avatar
                size="32"
                color="grey lighten-4"
              >
                <img :src="$store.state.user.imageUrl" alt="avatar">
              </v-avatar>
            </v-btn>
          </template>
          <v-card width="320">
            <v-container grid-list-md>
              <v-layout row wrap>
                <v-flex xs4>
                  <v-avatar
                    size="96"
                    color="grey lighten-4"
                  >
                    <img :src="$store.state.user.imageUrl" alt="avatar">
                  </v-avatar>
                </v-flex>
                <v-flex xs8>
                  <v-card-text>
                    <span class="font-weight-bold"> {{$store.state.user.name}}</span>
                    <br>
                    <span class="font-weight-thin">{{$store.state.user.email}}</span>
                  </v-card-text>
                </v-flex>
              </v-layout>
            </v-container>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="logout">로그아웃</v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
        <v-btn v-else color="lime darken-4" @click="login" small text outlined>로그인</v-btn>
      </v-toolbar-items>
    </v-app-bar>

    <v-dialog
      v-model="dialog"
      hide-overlay
      persistent
      width="300"
    >
      <v-card
        color="primary"
        dark
      >
        <v-card-text>
          Please stand by
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data: () => ({
    dialog: false,
    drawer: false,
    menus: [
      { title: 'Home', to: '/' },
      { title: 'Daily', to: '/daily' },
      { title: 'Category Settings', to: '/category' }
    ]
  }),
  methods: {
    login () {
      this.$router.push('/signin')
    },
    logout () {
      this.$gapi.auth2.getAuthInstance().signOut().then(() => {
        this.$store.state.user = null
      })
    }
  }
}
</script>
