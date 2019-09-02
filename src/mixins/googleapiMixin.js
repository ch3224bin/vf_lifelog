export default (function () {
  let methods = {
    getCategories () {
      return this.$gapi.client.calendar.calendarList.list({})
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

      return this.$gapi.client.calendar.events.list(query)
    },
    updateEvent (eventBody, cb) {
      this.$gapi.client.calendar.events.update(eventBody).execute(cb)
    }
  }

  /* api 호출 시 로딩바 적용을 위해 아래와 같이 함 */
  for (var i in methods) {
    let fn = methods[i]
    methods[i] = function () {
      this.$Progress.start()
      let result = fn.apply(this, arguments)
      this.$Progress.finish()
      return result
    }
  }

  return {
    methods: methods
  }
}())
