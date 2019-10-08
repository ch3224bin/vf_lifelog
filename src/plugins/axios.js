import axios from 'axios'
import store from '../store'

const ghttp = axios.create({
  baseURL: 'https://www.googleapis.com/calendar/v3'
})
ghttp.interceptors.request.use((config) => {
  config.headers.authorization = store.state.token
  return config
}, function (error) {
  return Promise.reject(error)
})

export default ghttp
