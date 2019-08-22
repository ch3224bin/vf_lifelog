import Vue from 'vue'
import showdown from 'showdown'

Vue.prototype.$sdConverter = new showdown.Converter()
