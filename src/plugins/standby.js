import Vue from 'vue'
import vuetify from './vuetify'
import PleaseStandBy from '../components/PleaseStandBy.vue'

let StandByPlugin = {
  install (Vue) {
    const DEFAULT_MESSAGE = 'Loading...'
    let Component = Vue.extend(PleaseStandBy)
    let instance = new Component({
      vuetify: vuetify
    })

    document.body.appendChild(instance.$mount().$el)

    Vue.prototype.$standby = {
      show (msg) {
        instance.msg = msg || DEFAULT_MESSAGE
        instance.dialog = true
      },
      hide () {
        instance.dialog = false
      }
    }
  }
}

Vue.use(StandByPlugin)

export default StandByPlugin
