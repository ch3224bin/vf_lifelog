<template>
  <v-container fluid grid-list-md>
    <v-layout row wrap justify-center>
      <v-flex xs12 sm10 md8 lg8 xl6>
        <v-card>
          <v-card-title primary-title>
            LifeLog에서 사용할 항목을 선택합니다.
          </v-card-title>
          <v-card-text>
            <v-list subheader>
              <template v-for="(item, index) in categories">
                <v-list-item
                  :key="item.id"
                >
                  <v-list-item-content>
                    <v-list-item-title v-text="item.summary"></v-list-item-title>
                  </v-list-item-content>

                  <v-list-item-action>
                    <v-switch v-model="item.enabled" @change="switchItem(item)"></v-switch>
                  </v-list-item-action>
                </v-list-item>
                <v-divider
                  v-if="index + 1 < categories.length"
                  :key="index"
                ></v-divider>
              </template>
            </v-list>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { gooleapiMixin } from '../plugins/googleapiMixin'

export default {
  mixins: [gooleapiMixin],
  mounted () {
    this.initCategories()
  },
  methods: {
    initCategories () {
      if (!this.$gapi || !this.$gapi.client || !this.$gapi.client.calendar) {
        setTimeout(this.initCategories, 100)
        return
      }
      let categories = this.getCategories()
      categories.then(res => {
        let categories = []
        res.result.items.forEach(e => {
          categories.push({ summary: e.summary, id: e.id, enabled: false })
        })

        let storedCategories = JSON.parse(localStorage.getItem('categories'))
        storedCategories.forEach(e => {
          let item = this.$_.find(categories, x => x.id === e.id)
          item.enabled = true
        })

        this.categories = categories
      })
    },
    switchItem (item) {
      let categories = JSON.parse(localStorage.getItem('categories'))
      if (!categories) {
        categories = []
      }
      if (item.enabled) {
        categories.push({ summary: item.summary, id: item.id })
      } else {
        this.$_.remove(categories, e => e.id === item.id)
      }
      localStorage.setItem('categories', JSON.stringify(categories))
    }
  },
  data () {
    return {
      categories: ''
    }
  }
}
</script>
