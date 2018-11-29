// initial state
const state = {
  connect: false,
  message: null,
  lock_harris: []
}

// getters
const getters = {
  lock_harris: state => state.lock_harris
}

// actions
const actions = {
  // otherAction: (context, type) => {
  //   return true
  // },
  // socket_lock_harris: (context, message) => {
  //   context.dispatch('lock_harris', message)
  //   // context.commit('NEW_MESSAGE_RECEIVED', message)
  //   // if (message.is_important) {
  //   //   context.dispatch('alertImportantMessage', message)
  //   // }
  // }
}

// mutations
const mutations = {
  SOCKET_CONNECT: (state, status) => {
    state.connect = true
  },
  SOCKET_LOCK_HARRIS: (state, message) => {
    state.message = message
    state.lock_harris = message[0]
  }
}

export default {
  state,
  getters,
  actions,
  mutations,
  namespaced: true
}
