<template>
  <v-container fluid grid-list-md>
    <v-layout row wrap justify-center>
      <v-flex xs12 sm10 md8 lg8 xl6>
        <v-form ref="form" v-model="valid">
          <v-card>
            <v-card-text>
              <v-select :rules="[v => !!v || 'Calendar is required']" :items="categories" item-text="summary" item-value="id" v-model="category" :label="$t('label.category')" required></v-select>
              <v-text-field :value="title" @change="v => title = v" :label="$t('label.title')"></v-text-field>
              <v-textarea :value="content" @change="v => content = v" :label="$t('label.description')" rows="3"></v-textarea>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="success" v-if="!progressData" :disabled="!valid" @click="start"><v-icon>mdi-alarm</v-icon> {{ $t('btn.start') }}</v-btn>
              <v-btn color="success" v-if="progressData" :loading="loading" :disabled="!valid || loading" @click="finish"><v-icon>mdi-alarm-check</v-icon> {{ $t('btn.finish') }}</v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-flex>
      <v-flex xs12 sm10 md8 lg8 xl6>
        <v-card>
          <v-card-title>
            <v-toolbar flat>
              <v-toolbar-title>{{ $t('label.history') }}</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon @click="refreshData"><v-icon>mdi-refresh</v-icon></v-btn>
            </v-toolbar>
          </v-card-title>
          <v-card-text>
            <v-list two-line subheader>
                <template v-for="(item , index) in events">
                  <v-divider
                    v-if="index !== 0 && index + 1 < events.length && item.header"
                    :key="index"
                  ></v-divider>
                  <v-subheader
                    v-if="item.header"
                    :key="item.header"
                    >{{ $d(item.date, 'shortWD') }}</v-subheader>
                  <v-list-item v-else :key="item.id">
                    <v-list-item-content>
                      <v-list-item-subtitle v-text="getDateTime(item)"></v-list-item-subtitle>
                      <v-list-item-title v-text="item.organizer.displayName"></v-list-item-title>
                      <v-list-item-subtitle class="text--primary" v-text="item.summary"></v-list-item-subtitle>
                      <v-list-item-subtitle><p v-html="mdToHtml(item.description)"></p></v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-list-item-action-text v-text="getMinTime(item)"></v-list-item-action-text>
                      <v-btn icon @click="openModifyPopup(item)"><v-icon>mdi-settings</v-icon></v-btn>
                    </v-list-item-action>
                  </v-list-item>
                </template>
            </v-list>
            <v-btn outlined block color="lime" :loading="readMoreLoading" :disabled="readMoreLoading"  @click="readMore">{{ $t('label.readMore') }}</v-btn>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

    <!-- 수정 팝업 -->
    <v-dialog v-model="dialog" persistent max-width="600">
      <v-card>
        <v-card-title class="headline">{{ $t('title.modify') }}</v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="mod.valid">
              <v-text-field
                v-model="mod.startTime"
                :label="$t('label.startTime')"
                type="datetime-local"
                required
              ></v-text-field>
              <v-text-field
                v-model="mod.endTime"
                :label="$t('label.endTime')"
                type="datetime-local"
                required
              ></v-text-field>
              <v-text-field :value="mod.summary" @change="v => mod.summary = v" :label="$t('label.title')"></v-text-field>
              <v-textarea :value="mod.description" @change="v => mod.description = v" :label="$t('label.description')" rows="3"></v-textarea>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" :loading="mod.loading" :disabled="mod.loading" text @click="dialog = false">{{ $t('btn.cancel') }}</v-btn>
          <v-btn color="green darken-1" :loading="mod.loading" :disabled="!mod.valid || mod.loading" text @click="modify">{{ $t('btn.save') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { gooleapiMixin } from '../plugins/googleapiMixin'
import { from } from 'rxjs'
import { mergeMap, map, reduce } from 'rxjs/operators'
import router from '@/router'
import _ from 'lodash'

const ONE_DAY = 1000 * 60 * 60 * 24

export default {
  mixins: [gooleapiMixin],
  created () {
    this.initCategories()
  },
  mounted () {
    this.refreshData()
    this.initForm()
  },
  watch: {
    title () {
      if (!this.progressData) return
      this.saveContent()
    },
    content () {
      if (!this.progressData) return
      this.saveContent()
    }
  },
  methods: {
    initForm () {
      if (!this.$store.state.isSignIn) {
        return
      }
      this.progressData = JSON.parse(localStorage.getItem('progress_data'))
      if (this.progressData) {
        this.category = this.progressData.category
        this.title = this.progressData.title
        this.content = this.progressData.content
      }
    },
    initCategories () {
      this.categories = JSON.parse(localStorage.getItem('categories'))
      if (!this.categories) {
        this.$toasted.global.info('Please select calendars.')
        router.push('/category')
      }
    },
    start () {
      this.progressData = { category: this.category, title: this.title, content: this.content, startTime: new Date().toISOString() }
      localStorage.setItem('progress_data', JSON.stringify(this.progressData))
    },
    finish () {
      let calendarId = this.progressData.category

      let event = {
        'summary': this.title,
        // TODO 로케이션 입력 여부 설정에 따라 'location': '800 Howard St., San Francisco, CA 94103',
        'description': this.content,
        'start': {
          'dateTime': this.progressData.startTime
        },
        'end': {
          'dateTime': new Date().toISOString()
        }
      }

      this.loading = true
      this.$gapi.client.calendar.events.insert({
        'calendarId': calendarId,
        'resource': event
      }).execute(event => {
        this.progressData = ''
        this.title = this.content = ''
        localStorage.removeItem('progress_data')
        this.$toasted.global.okay('Saved.')
        this.loading = false
        this.refreshData()
      })
    },
    /* 이벤트 기록 가져오기 */
    refreshData () {
      this.minDate = new Date(this.currentDate.getTime() - (ONE_DAY * 7))
      this.maxDate = new Date(this.currentDate.getTime() + ONE_DAY)
      this.events = null
      this.getData()
    },
    readMore () {
      this.maxDate = this.minDate
      this.minDate = new Date(this.minDate.getTime() - (ONE_DAY * 7))
      this.readMoreLoading = true
      this.getData()
        .subscribe(() => {
          this.readMoreLoading = false
        })
    },
    getData () {
      if (!this.$store.state.isSignIn) {
        return
      }
      // 카테로리 별 event list를 가져와서 합치고 정렬한다.
      let pub = from(this.categories).pipe(
        mergeMap(c => this.getEventsList(c.id, { minDate: this.minDate, maxDate: this.maxDate })),
        map(res => res.result.items),
        reduce((a, b) => a.concat(b))
      )

      pub.subscribe(r => {
        // 각 event에 start, end를 Date형으로 하나씩 넣어줬다.
        r.forEach(item => {
          item.startDate = new Date(item.start.dateTime)
          item.endDate = new Date(item.end.dateTime)
        })

        // 날짜별로 subheader를 끼워 넣는다.
        let eventList = this.$_.orderBy(r, ['startDate'], 'desc')
        let resultList = []
        let lastDate
        eventList.forEach((item) => {
          let startDate = item.startDate.format('yyyy-MM-dd E')
          if (lastDate !== startDate) {
            resultList.push({ header: startDate, date: item.startDate })
            lastDate = startDate
          }
          resultList.push(item)
        })
        if (this.events === null) {
          this.events = resultList
        } else {
          this.events = this.events.concat(resultList)
        }
      })

      return pub
    },
    /* 시간 표시 */
    getDateTime (item) {
      return `${item.startDate.format('a/p hh:mm')} ~ ${item.endDate.format('a/p hh:mm')}`
    },
    getMinTime (item) {
      let min = Math.round((item.endDate - item.startDate) / (1000 * 60))
      return `${this.$t('label.total')}: ${min}${this.$t('label.min')}`
    },
    openModifyPopup (item) {
      this.dialog = true
      this.mod.item = item
      // 아래 4개는 수정될 항목
      this.mod.startTime = item.startDate.format('yyyy-MM-ddTHH:mm')
      this.mod.endTime = item.endDate.format('yyyy-MM-ddTHH:mm')
      this.mod.summary = item.summary
      this.mod.description = item.description
    },
    modify () {
      this.mod.loading = true
      this.updateEvent({
        'calendarId': this.mod.item.organizer.email,
        'eventId': this.mod.item.id,
        'summary': this.mod.summary,
        'description': this.mod.description,
        'start': {
          'dateTime': new Date(this.mod.startTime).toISOString()
        },
        'end': {
          'dateTime': new Date(this.mod.endTime).toISOString()
        }
      }, (event) => {
        // 수정 내용 화면의 event에 적용
        this.mod.item.startDate = new Date(this.mod.startTime)
        this.mod.item.endDate = new Date(this.mod.endTime)
        this.mod.item.summary = this.mod.summary
        this.mod.item.description = this.mod.description
        this.mod.loading = false
        this.dialog = false
        this.$toasted.global.okay('Modified.')
      })
    },
    mdToHtml (text) {
      return this.$sdConverter.makeHtml(text)
    },
    saveContent: _.debounce(function () {
      this.progressData.title = this.title
      this.progressData.content = this.content
      localStorage.setItem('progress_data', JSON.stringify(this.progressData))
    }, 300)
  },
  data () {
    return {
      category: '',
      title: '',
      content: '',
      loading: false,
      readMoreLoading: false,
      progressData: '',
      valid: false,
      categories: '',
      events: null,
      currentDate: new Date(new Date().toDateString()),
      minDate: null,
      maxDate: null,
      dialog: false,
      mod: { valid: false, loading: false, item: null, summary: '', description: '', startTime: '', endTime: '' }
    }
  }
}
</script>
