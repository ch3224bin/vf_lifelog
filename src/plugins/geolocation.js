import Vue from 'vue'

const Geolocation = {
  _geoOptions: {
    enableHighAccuracy: true,
    timeout: 1000
  },
  _position: null,
  _startWatch () {
    navigator.geolocation.watchPosition((pos) => this._setPosition(pos), null, this._geoOptions)
  },
  _setPosition (pos) {
    this._position = { lat: pos.coords.latitude, lang: pos.coords.longitude }
  },
  install (Vue) {
    Vue.prototype.$geolocation = Geolocation
  },
  start () {
    if ('geolocation' in navigator) {
      this._startWatch()
    }
  },
  getPosition () {
    return new Promise((resolve, reject) => {
      let cnt = 0
      const tmr = setInterval(() => {
        if (this._position) {
          clearInterval(tmr)
          resolve(this._position)
        } else if (cnt++ > 20) {
          clearInterval(tmr)
          navigator.geolocation.getCurrentPosition((pos) => resolve({ lat: pos.coords.latitude, lang: pos.coords.longitude }), null, this._geoOptions)
        }
      }, 50)
    })
  }
}

Vue.use(Geolocation)