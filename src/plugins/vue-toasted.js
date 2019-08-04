import Vue from 'vue'
import Toasted from 'vue-toasted'

Vue.use(Toasted, {
  iconPack: 'mdi'
})

Vue.toasted.register('okay', (payload) => {
  return payload
}, {
  icon: 'mdi-hand-okay',
  position: 'bottom-center',
  duration: 3000,
  className: 'success'
})

Vue.toasted.register('info', (payload) => {
  return payload
}, {
  icon: 'mdi-information-outline',
  position: 'bottom-center',
  duration: 3000,
  className: 'info'
})
