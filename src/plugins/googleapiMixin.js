export const gooleapiMixin = {
  methods: {
    login () {
      this.$login()
    },
    logout () {
      this.$logout()
    },
    getCategories () {
      return this.$gapi.client.calendar.calendarList.list({})
    },
    getEventsList (calendarId, currentDate) {
      return this.$gapi.client.calendar.events.list({
        'calendarId': calendarId,
        'timeMin': (new Date('2019-07-01')).toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'orderBy': 'startTime'
      })
    }
  }
}
