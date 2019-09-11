<template>
  <v-fab-transition>
    <v-btn
      v-scroll="onScroll"
      fixed
      dark
      fab
      bottom
      right
      color="red"
      v-show="show"
      @click="scrollToTop"
      >
      <v-icon>mdi-chevron-up</v-icon>
    </v-btn>
  </v-fab-transition>
</template>
<script>
import goTo from 'vuetify/es5/services/goto'

export default {
  computed: {
    show () {
      return this.offsetTop > 200
    }
  },
  methods: {
    onScroll (e) {
      this.offsetTop = window.pageYOffset || document.documentElement.scrollTop
    },
    scrollToTop () {
      goTo(0, {
        duration: 300
      })
    }
  },
  data () {
    return {
      offsetTop: 0
    }
  }
}
</script>
