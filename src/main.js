// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import VueClipboard from 'vue-clipboard2'
import VueSocketio from 'vue-socket.io'

import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import store from './store'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)
Vue.use(Vuetify, {
  theme: {
    // primary: '#9d1626',
    // secondary: '#f9f9f9',
    // accent: '#f9b500'
  }
})
Vue.use(Vuex)
Vue.use(VueClipboard)

Vue.use(require('vue-moment'))

Vue.use(VueSocketio, '/', store)

Vue.config.productionTip = false

const dateTimeFormats = {
  'en': {
    short: {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }
  },
  'ru': {
    short: {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }
  }
}

const i18n = new VueI18n({
  locale: 'ru',
  fallbackLocale: 'ru',
  dateTimeFormats
})

new Vue({
  el: '#app',
  store,
  i18n,
  router,
  render: h => h(App)
}).$mount('#app')
