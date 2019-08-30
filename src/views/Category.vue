<template>
  <v-container fluid grid-list-md>
    <v-layout row wrap justify-center>
      <v-flex xs12 sm10 md8 lg8 xl6>
        <v-card>
          <v-card-title primary-title>
            {{ $t('msg.selectCategory') }}
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
            <v-btn
              absolute
              dark
              fab
              bottom
              right
              color="primary"
              @click="openAddCalendar"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <v-dialog v-model="dialog" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">{{ $t('title.addCategory') }}</v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="calendar.valid">
              <v-text-field
                v-model="calendar.summary"
                :label="$t('label.summary')"
              ></v-text-field>
              <v-text-field
                v-model="calendar.description"
                :label="$t('label.description')"
              ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="clearAdd">{{ $t('btn.cancel') }}</v-btn>
          <v-btn color="green darken-1" text @click="addCalendar">{{ $t('btn.add') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
      if (!this.$store.state.isSignIn) {
        return
      }
      let categories = this.getCategories()
      categories.then(res => {
        let categories = []
        res.result.items.forEach(e => {
          categories.push({ summary: e.summary, id: e.id, enabled: false })
        })

        let storedCategories = JSON.parse(localStorage.getItem('categories'))
        if (storedCategories) {
          storedCategories.forEach(e => {
            let item = this.$_.find(categories, x => x.id === e.id)
            item.enabled = true
          })
        }

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
    },
    openAddCalendar () {
      this.dialog = true
    },
    addCalendar () {
      this.$gapi.client.calendar.calendars.insert(this.calendar)
        .execute((c) => {
          this.$toasted.global.okay('Added.')
          this.initCategories()
          this.clearAdd()
        })
    },
    clearAdd () {
      this.calendar = { valid: false, summary: '', description: '' }
      this.dialog = false
    }
  },
  data () {
    return {
      categories: '',
      dialog: false,
      calendar: { valid: false, summary: '', description: '' }
    }
  }
}
</script>
