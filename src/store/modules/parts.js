// Store module for content list files

// import { Http } from '@/api/http'

// state
const state = {
  parts: [],
  meta: ''
}

// getters
const getters = {
  parts: state => state.parts,
  meta: state => state.meta
}

// actions
const actions = {
  clear ({ commit }) {
    commit('clear')
  },
  create ({ state, commit, dispatch }, timestamp) {
    commit('create', timestamp)
    commit('sort')
    dispatch('getImage')
  },
  getImage ({ commit, rootGetters, state }) {
    let chain = Promise.resolve()
    state.parts.forEach((part, partIndex) => {
      part.forEach((frame, frameIndex) => {
        if (!state.parts[partIndex][frameIndex].img) {
          chain = chain.then(() => rootGetters['files/image'](frame.timestamp)).then(img => {
            commit('setImage', { partIndex, frameIndex, img })
          })
        }
      })
    })
  },
  save () {

  },
  set ({ state, commit, dispatch }, { parts, meta }) {
    commit('set', { parts, meta })
    commit('sort')
    dispatch('getImage')
  },
  remove ({ state, commit }, numberParts) {
    commit('remove', numberParts)
  }
}

// mutations
const mutations = {
  clear (state) {
    state.meta = ''
    state.parts = []
  },
  create (state, timestamp) {
    let start = timestamp
    let end = timestamp
    const IMAGE = ''
    if (state.parts.length > 0) {
      state.parts.forEach(part => {
        part.forEach(frame => {
          if (frame.timestamp > timestamp) {
            if (end > frame.timestamp || end === timestamp) {
              end = frame.timestamp
            }
          }
          if (frame.timestamp < timestamp) {
            if (start < frame.timestamp || start === timestamp) {
              start = frame.timestamp
            }
          }
        })
      })
      // удалить отрезок, если он разбивается на два
      state.parts.forEach((part, partIndex) => {
        if (part[0].timestamp === start && part[1].timestamp === end) {
          state.parts.splice(partIndex, 1)
        }
      })
      // Вставка новых отрезков
      if (start !== timestamp) {
        state.parts.push([{ timestamp: start, img: IMAGE }, { timestamp: timestamp, img: IMAGE }])
      }
      if (end !== timestamp) {
        state.parts.push([{ timestamp: timestamp, img: IMAGE }, { timestamp: end, img: IMAGE }])
      }
    } else {
      state.parts.push([{ timestamp: timestamp, img: IMAGE }, { timestamp: timestamp + 1000, img: IMAGE }])
    }
  },
  remove (state, numberParts) {
    state.parts.splice(numberParts, 1)
  },
  sort (state) {
    let sortParts = []
    state.parts.forEach(part => sortParts.push(part.sort((a, b) => a.timestamp - b.timestamp)))
    state.parts = sortParts.sort((a, b) => a[0].timestamp - b[0].timestamp)
  },
  set (state, { meta, parts }) {
    if (meta) {
      state.meta = meta
    }
    if (parts) {
      state.parts = parts
    }
  },
  setImage (state, { partIndex, frameIndex, img }) {
    state.parts[partIndex][frameIndex].img = img
  }
}

export default {
  state,
  getters,
  actions,
  mutations,
  namespaced: true
}
