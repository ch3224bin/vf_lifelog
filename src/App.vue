<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      absolute
      temporary
      style="position:fixed; top:0; left:0; overflow-y:auto;"
    ><!-- drawer 스크롤이 본문을 따라가는 이슈 https://github.com/vuetifyjs/vuetify/issues/3385 -->
      <v-system-bar></v-system-bar>
      <template v-if="$store.state.user">
        <v-list-item>
          <v-list-item-avatar>
            <v-img :src="$store.state.user.imageUrl"></v-img>
          </v-list-item-avatar>
        </v-list-item>
        <v-list-item>
          <v-list-item-content >
            <v-list-item-title class="title">
              {{$store.state.user.name}}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{$store.state.user.email}}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>
      <v-list-item v-else>
        <v-list-item-content class="text-center">
          <v-btn rounded outlined color="primary" @click="login">
            Sign In
          </v-btn>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
      <v-list dense nav>
        <template
          v-for="item in menus"
        >
          <v-list-item
            link
            :to="item.to"
            :key="item.title"
            v-if="!item.subMenus"
          >
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>
            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item>
          <v-list-group
            v-model="item.active"
            :prepend-icon="item.icon"
            :key="item.title"
            no-action
            v-else>
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title v-t="item.code"></v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item
              v-for="subItem in item.subMenus"
              :key="subItem.title"
              :to="subItem.to"
              link>
              <v-list-item-content>
                <v-list-item-title v-t="subItem.code"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </template>
      </v-list>
      <v-footer v-if="$store.state.user" absolute>
        <v-btn block outlined small @click="logout">Sign Out</v-btn>
      </v-footer>
    </v-navigation-drawer>
    <v-app-bar app color="lime">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title class="headline text-uppercase">
        <span>LifeLog</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <langs-selector />
      </v-toolbar-items>
    </v-app-bar>
    <v-content>
      <router-view />
      <vue-progress-bar />
    </v-content>
  </v-app>
</template>

<script>
import LangsSelector from '@/components/LangsSelector'

export default {
  name: 'App',
  components: {
    LangsSelector
  },
  data: () => ({
    drawer: false,
    menus: [
      { title: 'Home', code: 'menu.home', to: '/', icon: 'mdi-home' },
      { title: '통계', code: 'menu.statistics', icon: 'mdi-chart-pie', subMenus: [{ title: '일일', code: 'menu.daily', to: '/daily' }], active: true },
      { title: '설정', code: 'menu.settings', icon: 'mdi-tools', subMenus: [{ title: '카테고리', code: 'menu.category', to: '/category' }] },
      { title: 'About', code: 'menu.about', to: '/about', icon: 'mdi-help-box' }
    ]
  }),
  methods: {
    login () {
      this.$router.push('/signin')
    },
    logout () {
      this.$gapi.auth2.getAuthInstance().signOut().then(() => {
        this.$store.state.user = null
        this.$router.push('/signin')
      })
    }
  }
}
</script>

<style>
*{ text-transform: none !important; }
</style>
