<template>
  <v-container grid-list-md>
    <v-layout row wrap justify-center>
      <v-flex xs12 sm10 md8 lg8 xl6>
        <v-card>
          <v-card-title primary-title>
            Daily statistics
          </v-card-title>
          <v-card-text>
            <v-layout row wrap>
              <v-flex xs12 sm12 md12 lg12 xl12>
                <v-row no-gutters>
                  <v-col cols="8">
                    <datepicker v-model="date" name="date" format="yyyy년 MM월 dd일" class="title"></datepicker>
                  </v-col>
                  <v-col cols="4">
                    <v-btn color="primary" @click="loadData">Search</v-btn>
                    <v-btn color="green" icon>
                      <v-icon>mdi-chart-bar</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-flex>
              <v-flex
                v-for="item in items"
                :key="item.name"
                xs12
                sm12
                md12
                lg6
                xl6>
                <v-card>
                  <v-card-title><h4>{{ item.name }}</h4></v-card-title>
                  <v-expansion-panels>
                    <v-expansion-panel v-for="subItem in item.subItems" :key="subItem.name">
                      <v-expansion-panel-header>
                        <v-row no-gutters>
                          <v-col cols="8">
                            {{ subItem.name }}
                          </v-col>
                          <v-col cols="4">
                            {{ getMinString(subItem.val) }}
                          </v-col>
                        </v-row>
                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <div v-html="mdToHtml(subItem.description)"></div>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>
                  <v-divider></v-divider>
                  <v-card-text>
                    <v-row no-gutters>
                      <v-col cols="8">
                        Total:
                      </v-col>
                      <v-col cols="4">
                        {{ getTotal(item) }}
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Datepicker from 'vuejs-datepicker'
import { gooleapiMixin } from '../plugins/googleapiMixin'
import { from } from 'rxjs'
import { mergeMap, map, reduce } from 'rxjs/operators'
import showdown from 'showdown'

const converter = new showdown.Converter()

export default {
  components: {
    Datepicker
  },
  mixins: [gooleapiMixin],
  created () {
    this.initCategories()
  },
  data () {
    return {
      date: new Date(),
      events: null,
      categories: null,
      items: []
    }
  },
  methods: {
    initCategories () {
      this.categories = JSON.parse(localStorage.getItem('categories'))
    },
    find (arr, name, value) {
      for (let i in arr) {
        if (arr[i][name] === value) {
          return arr[i]
        }
      }
      return ''
    },
    getMinString (mills) {
      return `${Math.round(mills / (1000 * 60))} Min`
    },
    getTotal (item) {
      let mills = 0
      item.subItems.forEach(e => {
        mills += e.val
      })
      let min = Math.round(mills / (1000 * 60))
      return `${Math.floor(min / 60)}Hour ${min % 60}Minute`
    },
    loadData () {
      let minDate = new Date(this.date.toDateString())
      let maxDate = new Date(minDate.getTime() + (1000 * 60 * 60 * 24))

      from(this.categories).pipe(
        mergeMap(c => this.getEventsList(c.id, { minDate: minDate, maxDate: maxDate })),
        map(res => res.result.items),
        reduce((a, b) => a.concat(b))
      ).subscribe(r => {
        // array로 가져온 결과를 [{name: 캘린더명, {name: 제목, subItems: []}}] 구조로 만든다.
        let result = []
        r.forEach(e => {
          let group = this.find(result, 'name', e.organizer.displayName)
          if (!group) {
            group = { name: e.organizer.displayName, subItems: [] }
            result.push(group)
          }
          let subGroup = this.find(group.subItems, 'name', e.summary)
          if (!subGroup) {
            subGroup = { name: e.summary, val: 0, description: '' }
            group.subItems.push(subGroup)
          }
          subGroup.val += new Date(e.end.dateTime) - new Date(e.start.dateTime)
          subGroup.description += '\n' + e.description
        })
        this.items = result
      })
    },
    mdToHtml (text) {
      return converter.makeHtml(text)
    }
  }
}
</script>
