<template>
  <v-container>
    <v-card-title primary-title>
      {{ $t('title.monthlyStatistics') }}
    </v-card-title>
    <v-card-text>
      <v-row no-gutters align="center" justify="center">
        <v-col cols="3" class="text-right">
          <v-btn fab text samll @click="prev">
            <v-icon small>mdi-chevron-left</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="5" md="3">
          <datepicker v-model="date" name="date" format="yyyy-MM" minimumView="month" maximumView="month" class="title" input-class="datepicker-input" :language="$store.datePickerLocale"></datepicker>
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

export default {
  components: {
    Datepicker
  },
  mounted () {
    this.date = new Date().trunc()
  },
  watch: {
    date () {
      this.minDate = this.getFirstday()
      this.maxDate = this.getLastday()

      this.$emit('select', { minDate: this.minDate, maxDate: this.maxDate })
    }
  },
  methods: {
    getFirstday () {
      return new Date(this.date.getFullYear(), this.date.getMonth(), 1)
    },
    getLastday () {
      let tempDate = new Date(this.date.getTime())
      tempDate.setMonth(tempDate.getMonth() + 1)
      return new Date(tempDate.getFullYear(), tempDate.getMonth(), 1)
    },
    prev () {
      this.date = new Date(this.date.setMonth(this.date.getMonth() - 1))
    },
    next () {
      this.date = new Date(this.date.setMonth(this.date.getMonth() + 1))
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
