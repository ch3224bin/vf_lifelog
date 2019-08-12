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
              <v-flex xs6 sm4 md 4 lg 3>
                <datepicker v-model="date" name="date" format="yyyy년 MM월 dd일" class="title"></datepicker>
              </v-flex>
              <v-flex xs6 sm4 md4 lg3>
                <v-btn color="primary" @click="loadData">Search</v-btn>
              </v-flex>
            </v-layout>
            <v-layout wrap>
              <v-flex
                v-for="item in items"
                :key="item.name"
                xs12
                sm6
                md4
                lg4
              >
                <v-card>
                  <v-card-title><h4>{{ item.name }}</h4></v-card-title>
                  <v-divider></v-divider>
                  <v-list dense>
                    <v-list-item  v-for="subItem in item.subItems" :key="subItem.name">
                      <v-list-item-content class="subtitle-1">{{ subItem.name }}</v-list-item-content>
                      <v-list-item-content class="align-end">{{ getMinString(subItem.val) }}</v-list-item-content>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item >
                      <v-list-item-content class="subtitle-1">Total: </v-list-item-content>
                      <v-list-item-content class="align-end">{{ getTotal(item) }}</v-list-item-content>
                    </v-list-item>
                  </v-list>
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
      return `${Math.round(mills / (1000 * 60))} Minute`
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
            subGroup = { name: e.summary, val: 0 }
            group.subItems.push(subGroup)
          }
          subGroup.val += new Date(e.end.dateTime) - new Date(e.start.dateTime)
        })
        this.items = result
      })
    }
  }
}
</script>
