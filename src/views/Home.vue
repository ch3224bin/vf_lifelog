<template>
  <v-container fluid grid-list-md>
    <v-layout row wrap justify-center>
      <v-flex xs12 sm10 md8 lg8 xl6>
        <v-form ref="form" v-model="valid">
          <v-card>
            <v-card-text>
              <v-select :rules="[v => !!v || 'Calendar is required']" :items="categories" item-text="summary" item-value="id" v-model="category" label="Calendar" required></v-select>
              <v-text-field v-model="title" label="Title"></v-text-field>
              <v-textarea v-model="content" label="Content" rows="3"></v-textarea>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="success" v-if="!progressData" :disabled="!valid" @click="start"><v-icon>mdi-alarm</v-icon> Start</v-btn>
              <v-btn color="success" v-if="progressData" :disabled="!valid" @click="finish"><v-icon>mdi-alarm-check</v-icon> Finish</v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-flex>
      <v-flex xs12 sm10 md8 lg8 xl6>
        <v-card>
          <v-card-title>
            <v-toolbar flat>
              <v-toolbar-title>History</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon @click="refreshData"><v-icon>mdi-refresh</v-icon></v-btn>
            </v-toolbar>
          </v-card-title>
          <v-card-text>
            <v-list two-line subheader>
                <template v-for="(item , index) in events">
                  <v-subheader
                    v-if="item.header"
                    :key="item.header"
                    v-text="item.header"
                  ></v-subheader>
                  <v-list-item v-else :key="item.id">
                    <v-list-item-content>
                      <v-list-item-subtitle v-text="getDateTime(item)"></v-list-item-subtitle>
                      <v-list-item-title v-text="item.organizer.displayName"></v-list-item-title>
                      <v-list-item-subtitle class="text--primary" v-text="item.summary"></v-list-item-subtitle>
                      <v-list-item-subtitle><pre>{{ item.description }}</pre></v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-list-item-action-text v-text="getMinTime(item)"></v-list-item-action-text>
                      <v-btn icon @click="modify(item)"><v-icon>mdi-settings</v-icon></v-btn>
                    </v-list-item-action>
                  </v-list-item>
                  <v-divider
                    v-if="index + 1 < events.length"
                    :key="index"
                  ></v-divider>
                </template>
            </v-list>
            <v-btn outlined block color="lime" @click="readMore">Read more</v-btn>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

    <v-dialog v-model="dialog" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">Modify</v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="mod.valid">
              <v-text-field
                v-model="mod.startTime"
                label="Start Date Time"
                type="datetime-local"
              ></v-text-field>
              <v-text-field v-model="mod.title" label="Title"></v-text-field>
              <v-textarea v-model="mod.content" label="Content" rows="3"></v-textarea>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="test">Cancel</v-btn>
          <v-btn color="green darken-1" text @click="dialog = false">Save</v-btn>
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

      this.$gapi.client.calendar.events.insert({
        'calendarId': calendarId,
        'resource': event
      }).execute(event => {
        this.progressData = ''
        this.title = this.content = ''
        localStorage.removeItem('progress_data')
        this.$toasted.global.okay('Saved.')
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
      this.getData()
    },
    getData () {
      if (!this.$store.state.isSignIn) {
        return
      }
      // 카테로리 별 event list를 가져와서 합치고 정렬한다.
      from(this.categories).pipe(
        mergeMap(c => this.getEventsList(c.id, { minDate: this.minDate, maxDate: this.maxDate })),
        map(res => res.result.items),
        reduce((a, b) => a.concat(b))
      ).subscribe(r => {
        if (this.events === null) {
          this.events = this.$_.orderBy(r, ['start.dateTime'], 'desc')
        } else {
          this.events = this.events.concat(this.$_.orderBy(r, ['start.dateTime'], 'desc'))
        }
      })
    },
    /* 시간 표시 */
    getDateTime (item) {
      let startTime = new Date(item.start.dateTime)
      let endTime = new Date(item.end.dateTime)
      return `${startTime.toLocaleTimeString()} ~ ${endTime.toLocaleTimeString()}`
    },
    getMinTime (item) {
      let startTime = new Date(item.start.dateTime)
      let endTime = new Date(item.end.dateTime)
      let min = Math.round((endTime - startTime) / (1000 * 60))
      return `Total: ${min}Min`
    },
    modify (item) {
      this.dialog = true
    },
    test (item) {
      console.log(this.mod.startTime)
    }
  },
  data () {
    return {
      category: '',
      title: '',
      content: '',
      progressData: '',
      valid: false,
      categories: '',
      events: null,
      currentDate: new Date(new Date().toDateString()),
      minDate: null,
      maxDate: null,
      dialog: false,
      mod: { valid: false, title: '', content: '', startTime: '2019-08-09T12:01', endTime: '' }
    }
  }
}
</script>
