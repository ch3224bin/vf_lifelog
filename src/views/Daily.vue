<template>
  <v-container grid-list-md>
    <v-layout row wrap justify-center>
      <v-flex xs12 sm10 md8 lg8 xl6>
        <v-card>
          <v-card-title primary-title>
            {{ $t('label.title.dailyStatistics') }}
          </v-card-title>
          <v-card-text>
            <v-layout row wrap>
              <v-flex xs12 sm12 md12 lg12 xl12>
                <v-row no-gutters>
                  <v-col cols="6">
                    <datepicker v-model="date" name="date" format="yyyy-MM-dd" class="title" :language="$store.datePickerLocale"></datepicker>
                  </v-col>
                  <v-col cols="6" class="text-right">
                    <v-btn class="mx-2" color="primary" fab small dark @click="loadData"><v-icon>mdi-magnify</v-icon></v-btn>
                    <v-btn class="mx-2" color="green" fab small dark @click="toggleChart = !toggleChart">
                      <v-icon>mdi-chart-bar</v-icon>
                    </v-btn>
                    <v-btn class="mx-2" color="green" fab small dark @click="openClipboardDialog">
                      <v-icon>mdi-clipboard-text</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-flex>
              <v-flex v-if="toggleChart" xs12 sm12 md12 lg12 xl12>
                <g-chart
                  type="PieChart"
                  :data="chartData"
                  :options="chartOptions"
                  style="min-height: 330px;"
                  />
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
                  <v-card-text class="text-right">
                    {{ $t('label.total') }}: {{ getTotal(item) }}
                  </v-card-text>
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
                </v-card>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <v-dialog v-model="clipboardDialog" max-width="600">
      <v-card>
        <v-card-title>
          {{ $t('label.title.statisticsSummary') }}
        </v-card-title>
        <v-card-text>
          <v-textarea solo v-model="clipboardText" ref="copyContainer"></v-textarea>
        </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="primary" @click="doCopy">{{ $t('label.copy') }}</v-btn>
          <v-btn color="secondary" @click="clipboardDialog = false">{{ $t('label.close') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import Datepicker from 'vuejs-datepicker'
import { gooleapiMixin } from '../plugins/googleapiMixin'
import { from } from 'rxjs'
import { mergeMap, map, reduce } from 'rxjs/operators'
import { GChart } from 'vue-google-charts'

const ONE_DAY_MILLS = 1000 * 60 * 60 * 24

export default {
  components: {
    Datepicker, GChart
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
      items: [],
      toggleChart: false,
      chartData: null,
      chartOptions: {
        pieSliceText: 'value',
        legend: { position: 'top' }
      },
      clipboardText: '',
      clipboardDialog: false
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
    getMin (mills) {
      return Math.round(mills / (1000 * 60))
    },
    getMinString (mills) {
      return `${this.getMin(mills)} ${this.$t('label.min')}`
    },
    getMinToHourMinFormat (min) {
      return `${Math.floor(min / 60)}${this.$t('label.hours')} ${min % 60}${this.$t('label.min')}`
    },
    getTotal (item) {
      let min = this.getTotalMin(item)
      return this.getMinToHourMinFormat(min)
    },
    getTotalMin (item) {
      let mills = 0
      item.subItems.forEach(e => {
        mills += e.val
      })
      return Math.round(mills / (1000 * 60))
    },
    loadData () {
      let minDate = new Date(this.date.toDateString())
      let maxDate = new Date(minDate.getTime() + ONE_DAY_MILLS)

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
        // card list로 나오는 데이터
        this.items = result
        // 차트 데이터
        let chartData = this.$_.map(result,
          (item) => {
            let min = this.getTotalMin(item)
            return [item.name, { v: min, f: this.getMinToHourMinFormat(min) }]
          })
        this.chartData = [
          ['Task', 'Hours per Day']
        ].concat(chartData)
      })
    },
    mdToHtml (text) {
      return this.$sdConverter.makeHtml(text)
    },
    openClipboardDialog () {
      // text로 변환
      let text = ''
      let totalMills = 0
      if (this.items) {
        this.items.forEach((o, i) => {
          text += `${o.name}:\n`
          o.subItems.forEach(s => {
            text += `    ${s.name} - ${this.getMinString(s.val)}\n`
            totalMills += s.val
          })
        })
        text += `\n${this.$t('label.total')} ${this.getMinToHourMinFormat(this.getMin(totalMills))}`
      }
      this.clipboardText = text
      this.clipboardDialog = true
    },
    doCopy () {
      let toasted = this.$toasted
      this.$copyText(this.clipboardText, this.$refs.copyContainer.$el).then(function (e) {
        toasted.global.okay('클립보드에 복사되었습니다.')
      }, function (e) {
        toasted.global.error('Failed to copy texts')
      })
    }
  }
}
</script>
