import Vue from 'vue'
import Router from 'vue-router'

import Auth from '@/layers/Login'
import Home from '@/layers/Home'
import Videos from '@/layers/Videos'
import Players from '@/layers/Players'

import store from '@/store'

Vue.use(Router)

const ifNotAuthenticated = (to, from, next) => {
  if (!store.getters['auth/isLoggedIn']) {
    next()
    return
  }
  next('/')
}

const ifAuthenticated = (to, from, next) => {
  if (store.getters['auth/isLoggedIn']) {
    next()
    return
  }
  next('/login')
}

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Home,
      beforeEnter: ifAuthenticated
    },
    {
      path: '/videos',
      component: Videos,
      beforeEnter: ifAuthenticated
    },
    {
      path: '/players',
      component: Players,
      beforeEnter: ifAuthenticated
    },
    {
      path: '/login',
      name: 'login',
      component: Auth,
      beforeEnter: ifNotAuthenticated
    },
    { path: '/*', redirect: '/' }
  ]
})
