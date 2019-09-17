<template>
  <v-container>
    <v-card-title primary-title>
      {{ $t('title.dailyStatistics') }}
    </v-card-title>
    <v-card-text>
      <v-row no-gutters align="center" justify="center">
        <v-col cols="3" class="text-right">
          <v-btn fab text samll @click="prev">
            <v-icon small>mdi-chevron-left</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="5" md="3">
          <datepicker v-model="date" name="date" format="yyyy-MM-dd" class="title" input-class="datepicker-input" :language="$store.datePickerLocale"></datepicker>
        </v-col>
        <v-col cols="3" class="text-left">
          <v-btn fab text small @click="next">
            <v-icon small>mdi-chevron-right</v-icon>
          </v-btn>
        </v-col>
      </v-row>
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
    this.date = new Date().trunc()
  },
  watch: {
    date () {
      let minDate = this.date
      let maxDate = new Date(minDate.getTime() + ONE_DAY_MILLS)

      this.$emit('select', { minDate, maxDate })
    }
  },
  methods: {
    prev () {
      this.date = new Date(this.date.getTime() - ONE_DAY_MILLS)
    },
    next () {
      this.date = new Date(this.date.getTime() + ONE_DAY_MILLS)
    },
    getLabel () {
      return this.date.format('yyyy-MM-dd')
    }
  },
  data () {
    return {
      date: null
    }
  }
}
</script>
