<template>
  <v-container>
    <v-card-title primary-title>
      {{ $t('title.weeklyStatistics') }}
    </v-card-title>
    <v-card-text>
      <v-row no-gutters align="center" justify="center">
        <v-col cols="12">
          <v-row no-gutters align="center" justify="center">
            <v-col cols="3" class="text-right">
              <v-btn fab text samll @click="prev">
                <v-icon small>mdi-chevron-left</v-icon>
              </v-btn>
            </v-col>
            <v-col cols="6" md="3" class="text-center">
              <datepicker v-model="date" name="date" :format="week" class="title" input-class="datepicker-input" :language="$store.state.datePickerLocale"></datepicker>
            </v-col>
            <v-col cols="3" class="text-left">
              <v-btn fab text small @click="next">
                <v-icon small>mdi-chevron-right</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row no-gutters align="center" justify="center">
        <v-col cols="6" class="text-center">
          {{ dateTerm }}
        </v-col>
      </v-row>
      <v-row no-gutters align="center" justify="center">
        <v-col cols="4">
        </v-col>
      </v-row>
    </v-card-text>
  </v-container>
</template>

<script>
import Datepicker from 'vuejs-datepicker'

const ONE_DAY_MILLS = 1000 * 60 * 60 * 24
const A_WEEK_MILLS = ONE_DAY_MILLS * 7

export default {
  components: {
    Datepicker
  },
  mounted () {
    this.date = new Date().trunc()
  },
  computed: {
    week () {
      return this.getWeek()
    },
    dateTerm () {
      return `${this.$moment(this.minDate).format('YYYY-MM-DD')} ~ ${this.$moment(this.maxDate).add(-1, 'day').format('YYYY-MM-DD')}`
    }
  },
  watch: {
    date () {
      this.minDate = this.getMonday(this.date)
      this.maxDate = this.getSunday(this.date)

      this.$emit('select', { minDate: this.minDate, maxDate: this.maxDate })
    }
  },
  methods: {
    getWeek () {
      let firstDayOfYear = this.getFirstDayOfYear(this.date)
      let monday = this.getMonday(firstDayOfYear)
      return `${firstDayOfYear.getFullYear()}${this.$t('label.year')} ${Math.ceil((this.date.getTime() - monday.getTime() + ONE_DAY_MILLS) / A_WEEK_MILLS)}${this.$t('label.week')}`
    },
    getFirstDayOfYear (currDate) {
      let fd = new Date(`${currDate.getFullYear()}-01-01`)
      if (fd.getDay() === 0 || fd.getDay() > 3) {
        if (this.getMonday(currDate).getFullYear() === currDate.getFullYear() - 1) {
          return this.getFirstDayOfYear(new Date(fd.getTime() - A_WEEK_MILLS))
        } else {
          return new Date(fd.getTime() + A_WEEK_MILLS)
        }
      } else {
        if (this.getWedday(currDate).getFullYear() === currDate.getFullYear() + 1) {
          return this.getFirstDayOfYear(new Date(currDate.getTime() + A_WEEK_MILLS))
        }
      }
      return fd
    },
    getMonday (date) {
      let day = date.getDay()
      let diff = day - 1
      if (diff === -1) {
        diff = 6
      }
      return new Date(date.getTime() - (diff * ONE_DAY_MILLS))
    },
    getWedday (date) {
      let monday = this.getMonday(date)
      return new Date(monday.getTime() + (2 * ONE_DAY_MILLS))
    },
    getSunday (date) {
      let monday = this.getMonday(date)
      return new Date(monday.getTime() + A_WEEK_MILLS)
    },
    prev () {
      this.date = new Date(this.date.getTime() - A_WEEK_MILLS)
    },
    next () {
      this.date = new Date(this.date.getTime() + A_WEEK_MILLS)
    },
    getLabel () {
      return this.dateTerm
    }
  },
  data () {
    return {
      minDate: null,
      maxDate: null,
      date: new Date().trunc()
    }
  }
}
</script>
