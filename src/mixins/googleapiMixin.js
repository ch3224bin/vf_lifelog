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
    insertEvent (eventBody) {
      return this.$gapi.client.calendar.events.insert(eventBody)
    },
    patchEvent (eventBody) {
      return this.$gapi.client.calendar.events.patch(eventBody)
    }
  }

  /* api 호출 시 로딩바 적용을 위해 아래와 같이 함 */
  for (var i in methods) {
    let fn = methods[i]
    methods[i] = async function () {
      this.$Progress.start()
      this.$store.commit('setBtnLoading', true)
      // 호출전 인증이 살아 있는지 확인
      if (!this.$isAuthenticated()) {
        await this.$loadGapi()
      }
      let result = await fn.apply(this, arguments)
      this.$Progress.finish()
      this.$store.commit('setBtnLoading', false)
      return result
    }
  }

  return {
    methods: methods,
    computed: {
      btnLoading () {
        return this.$store.state.btnLoading
      }
    }
  }
}())
