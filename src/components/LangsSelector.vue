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
export default {
  mounted () {
    let lang = localStorage.getItem('lang')
    let findLang = this.$_.find(this.langs, o => o.value === lang)
    if (!findLang) {
      this.langLabel = this.langs[0].label
      return
    }
    this.langLabel = findLang.label
  },
  methods: {
    select (item) {
      localStorage.setItem('lang', item.value)
      this.langLabel = item.label
    }
  },
  data () {
    return {
      langs: [
        { label: '한국어', value: 'ko' },
        { label: 'English', value: 'en' }
      ],
      langLabel: ''
    }
  }
}
</script>
