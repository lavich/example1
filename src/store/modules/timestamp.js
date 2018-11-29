// state
const state = {
  timestamp: null
}

// getters
const getters = {
  timestamp: state => state.timestamp
}

// actions
const actions = {
  change: ({ state, commit }, newTimestamp) => {
    commit('setTimestamp', newTimestamp)
  },
  init: ({ state, commit }, offset) => {
    let d = new Date()
    if (offset) {
      d.setDate(d.getDate() + offset)
    }
    commit('setTimestamp', d / 1)
  }
}

// mutations
const mutations = {
  setTimestamp (state, newTimestamp) {
    state.timestamp = newTimestamp
  }
}

export default {
  state,
  getters,
  actions,
  mutations,
  namespaced: true
}
