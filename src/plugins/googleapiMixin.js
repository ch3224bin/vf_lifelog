import Vue from 'vue'

/* gapi에 어떻게 공통으로 로딩바를 넣을지 고민중 */
async function pb (fn, args) {
  Vue.prototype.$Progress.start()
  let r = await fn(args)
  Vue.prototype.$Progress.finish()
  return r
}

export const gooleapiMixin = {
  methods: {
    getCategories () {
      return pb(this.$gapi.client.calendar.calendarList.list, {})
    },
    getEventsList (calendarId, { minDate, maxDate }) {
      let query = {
        'calendarId': calendarId,
        'showDeleted': false,
        'singleEvents': true,
        'orderBy': 'startTime'
      }

      if (minDate) {
        query.timeMin = (minDate).toISOString()
      }

      if (maxDate) {
        query.timeMax = (maxDate).toISOString()
      }

      return pb(this.$gapi.client.calendar.events.list, query)
    },
    async updateEvent (eventBody, cb) {
      let r = await pb(this.$gapi.client.calendar.events.update, eventBody)
      cb(r)
    }
  }
}
