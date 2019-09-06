<template>
  <v-container grid-list-md>
    <v-layout row wrap justify-center>
      <v-flex xs12 sm10 md8 lg8 xl8>
        <v-card>
          <!-- 검색조건 컴포넌트 동적 적용 -->
          <component :is="currentSearchView" @select="setDate" />
          <v-divider></v-divider>
          <v-card-actions>
            <v-row>
              <v-col>
                <v-btn block color="primary" @click="loadData"><v-icon left>mdi-magnify</v-icon>검색</v-btn>
              </v-col>
              <v-col>
                <v-btn block color="success" @click="toggleChart = !toggleChart">
                  <v-icon left>mdi-chart-bar</v-icon>
                  차트
                </v-btn>
              </v-col>
              <v-col>
                <v-btn block color="success" @click="openClipboardDialog">
                  <v-icon left>mdi-clipboard-text</v-icon>
                  텍스트
                </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex v-if="toggleChart" xs12 sm10 md8 lg8 xl8>
        <g-chart
          type="PieChart"
          :data="chartData"
          :options="chartOptions"
          style="min-height: 330px;"
          />
      </v-flex>
      <v-flex xs12 sm10 md8 lg8 xl6>
        <statement-of-life :items="items" />
      </v-flex>
    </v-layout>
    <v-dialog v-model="clipboardDialog" max-width="600">
      <v-card>
        <v-card-title>
          {{ $t('title.statisticsSummary') }}
        </v-card-title>
        <v-card-text>
          <v-textarea solo v-model="clipboardText" ref="copyContainer"></v-textarea>
        </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="primary" @click="doCopy">{{ $t('btn.copy') }}</v-btn>
          <v-btn color="secondary" @click="clipboardDialog = false">{{ $t('btn.close') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import gooleapiMixin from '../mixins/googleapiMixin'
import { from } from 'rxjs'
import { mergeMap, map, reduce } from 'rxjs/operators'
import { GChart } from 'vue-google-charts'
import StatementOfLife from '@/components/StatementOfLife'
import { dateFormatMixin } from '../mixins/dateformat'
import { DailySearch, WeeklySearch } from '@/components/searchviews'

const searchViews = {
  'daily': DailySearch,
  'weekly': WeeklySearch
}

export default {
  components: {
    GChart, StatementOfLife, DailySearch
  },
  mixins: [gooleapiMixin, dateFormatMixin],
  created () {
    this.initCategories()
    this.initView()
  },
  watch: {
    '$route' () {
      this.initView()
    }
  },
  data () {
    return {
      minDate: null,
      maxDate: null,
      events: null,
      categories: null,
      items: [],
      toggleChart: false,
      chartData: null,
      currentSearchView: DailySearch,
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
    initView () {
      this.currentSearchView = searchViews[this.$route.name]
      this.items = []
      this.chartData = null
      this.toggleChart = false
    },
    find (arr, name, value) {
      for (var i in arr) {
        if (arr[i][name] === value) {
          return arr[i]
        }
      }
      return ''
    },
    setDate (o) {
      this.minDate = o.minDate
      this.maxDate = o.maxDate
    },
    loadData () {
      from(this.categories).pipe(
        mergeMap(c => this.getEventsList(c.id, { minDate: this.minDate, maxDate: this.maxDate })),
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
      this.$copyText(this.clipboardText, this.$refs.copyContainer.$el).then((e) => {
        this.$toasted.global.okay(this.$t('msg.copiedClipboard'))
      }, (e) => {
        this.$toasted.global.error('Failed to copy texts')
      })
    }
  }
}
</script>
<style>
.datepicker-input {
  padding: 0.5em 0.5em 0.25em 0.5em;
  border-bottom: 1px solid #ccc;
  width: 100%;
}
</style>
