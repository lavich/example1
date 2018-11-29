import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth'
import common from './modules/common'
import files from './modules/files'
import thumbnail from './modules/thumbnail'
import timestamp from './modules/timestamp'
import websockets from './modules/websockets'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    auth,
    common,
    files,
    thumbnail,
    timestamp,
    websockets
  },
  strict: debug
})
