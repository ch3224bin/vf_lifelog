import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import store from './store'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/signin',
      name: 'signin',
      component: () => import('./views/SignIn.vue')
    },
    {
      path: '/category',
      name: 'category',
      component: () => import('./views/Category.vue')
    },
    {
      path: '/daily',
      name: 'daily',
      component: () => import('./views/Statistics.vue')
    },
    {
      path: '/weekly',
      name: 'weekly',
      component: () => import('./views/Statistics.vue')
    },
    {
      path: '/monthly',
      name: 'monthly',
      component: () => import('./views/Statistics.vue')
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    }
  ]
})

const waitGapiLoad = () => {
  return new Promise((resolve, reject) => {
    let cnt = 0
    const tmr = setInterval(() => {
      if (store.state.gapiLoaded) {
        clearInterval(tmr)
        resolve()
      } else if (cnt++ > 500) reject(Error('제한 시간 초과, 인터넷 연결을 확인하세요'))
    }, 10)
  })
}

router.beforeEach((to, from, next) => {
  Vue.prototype.$standby.show()
  waitGapiLoad()
    .then(() => {
      if (!/about|signin/.test(to.path) && !store.state.isSignIn) {
        /* 로그인이 안되어 있으면 로그인 화면으로 */
        if (/about|signin/.test(from.path)) {
          // 같은 path로 이동시 네비게이션 이동 없음
          Vue.prototype.$standby.hide()
        }
        next('/signin')
        return
      }
      next()
    })
    .catch(e => console.log(e.message))
})

router.afterEach((to, from) => {
  Vue.prototype.$standby.hide()
})

export default router
