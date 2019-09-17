import Vue from 'vue'
import moment from 'moment'

moment.locale('ko') // default 'ko', LangsSelector.vue에서 변경됨.
Vue.prototype.$moment = moment
