export const dateFormatMixin = {
  methods: {
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
    }
  }
}
