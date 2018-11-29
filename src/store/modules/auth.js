// initial state
const state = {
  isLoggedIn: false,
  roles: {
    admin: {
      create: true,
      read: true,
      update: true,
      delete: true
    },
    boss: {
      create: true,
      read: true,
      update: true,
      delete: true
    },
    editor: {
      create: true,
      read: true,
      update: true,
      delete: false
    },
    guest: {
      create: false,
      read: true,
      update: false,
      delete: false
    }
  },
  users: [
    { username: 'admin', password: 'admin', role: 'admin' },
    { username: 'boss', password: 'boss', role: 'boss' },
    { username: 'editor', password: 'editor', role: 'editor' },
    { username: 'guest', password: 'guest', role: 'guest' }
  ],
  user: {}
}

// getters
const getters = {
  accessRules (state) {
    if (state.user) {
      return state.roles[state.user.role]
    }
  },
  user: state => state.user,
  isLoggedIn: state => state.isLoggedIn
}

// actions
const actions = {
  login ({ state, commit }, data) {
    let user = state.users.find(user => data.username === user.username && data.password === user.password)
    if (user) {
      commit('login', user)
    }
  },
  logout ({ state, commit }) {
    commit('logout')
  }
}

// mutations
const mutations = {
  login (state, user) {
    state.user = user
    state.isLoggedIn = true
  },
  logout (state) {
    state.user = {}
    state.isLoggedIn = false
  }
}

export default {
  state,
  getters,
  actions,
  mutations,
  namespaced: true
}
