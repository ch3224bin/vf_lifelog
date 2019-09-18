import Vue from 'vue'

Vue.config.errorHandler = (err, vm, info) => {
  vm.$toasted.global.error(info)
  console.log(err)
}
