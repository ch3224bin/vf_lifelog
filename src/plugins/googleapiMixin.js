export const gooleapiMixin = {
  methods: {
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
    }
  }
}
