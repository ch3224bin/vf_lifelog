<template>
  <v-container>
    <v-card-title primary-title>
      {{ $t('title.dailyStatistics') }}
    </v-card-title>
    <v-card-text>
      <datepicker v-model="date" name="date" format="yyyy-MM-dd" class="title" :language="$store.datePickerLocale"></datepicker>
    </v-card-text>
  </v-container>
</template>

<script>
import Datepicker from 'vuejs-datepicker'

const ONE_DAY_MILLS = 1000 * 60 * 60 * 24

export default {
  components: {
    Datepicker
  },
  mounted () {
    this.date = new Date()
  },
  watch: {
    date () {
      let minDate = new Date(this.date.toDateString())
      let maxDate = new Date(minDate.getTime() + ONE_DAY_MILLS)

      this.$emit('select', { minDate, maxDate })
    }
  },
  data () {
    return {
      date: null
    }
  }
}
</script>
