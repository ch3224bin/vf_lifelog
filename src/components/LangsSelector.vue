<template>
  <v-menu offset-y>
    <template v-slot:activator="{ on }">
      <v-btn text small v-on="on">
        {{ langLabel }}
        <v-icon>mdi-menu-down</v-icon>
      </v-btn>
    </template>
    <v-list>
      <v-list-item
        v-for="(item, i) in langs"
        :key="i"
        @click="select(item)"
      >
        <v-list-item-title>{{ item.label }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import { ko, en } from 'vuejs-datepicker/dist/locale'
import store from '@/store'

export default {
  mounted () {
    let lang = localStorage.getItem('lang')
    let findLang = this.$_.find(this.langs, o => o.value === lang)
    if (!findLang) {
      this.langLabel = this.langs[0].label
      store.commit('setDatePickerLocale', ko)
      return
    }
    this.setLang(findLang.label, findLang.value)
    store.commit('setDatePickerLocale', findLang.dl)
  },
  methods: {
    select (item) {
      localStorage.setItem('lang', item.value)
      this.setLang(item.label, item.value)
    },
    setLang (label, value) {
      this.$i18n.locale = value
      this.langLabel = label
      this.$moment.locale(value)
      this.$firebase.auth().languageCode = value
    }
  },
  data () {
    return {
      langs: [
        { label: '한국어', value: 'ko', dl: ko },
        { label: 'English', value: 'en', dl: en }
      ],
      langLabel: ''
    }
  }
}
</script>
