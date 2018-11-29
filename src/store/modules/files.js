// Store module for content list files

import { Http } from '@/api/http'
import moment from 'moment-timezone'
import getFramePromise from '@/utils/captureFrame'

// state
const state = {
  files: []
}

// getters
const getters = {
  files: state => state.files,
  source: state => timestamp => {
    let src = state.files.find(file => (file.start <= timestamp) && (timestamp <= file.end))
    if (src) {
      src.currentTime = (timestamp - src.start) / 1000
      src.url = '/content/' + src.name
    }
    return src
  },
  image: (state, getters) => timestamp => {
    let src = getters.source(timestamp)
    if (src) {
      return new Promise((resolve) => {
        getFramePromise(src.url, src.currentTime).then(img => resolve(img))
      })
    } else {
      return ''
    }
  }
}

// actions
const actions = {
  fetchFiles: ({ state, commit }) => {
    Http.get('/content/').then(response => {
      commit('parseFiles', response.data)
    }).catch(error => {
      commit('common/setError', error, { root: true })
    })
  }
}

// mutations
const mutations = {
  parseFiles (state, data) {
    let resultArray = []
    for (let i = 0; i < data.length; i++) {
      let timestamp = null
      let filename = data[i].name.split('/').pop()
      let matchObj = filename.match(/(\d{4})_(\d{2})_(\d{2})_(\d{2})(\d{2})(\d{2})(\d{3})/)
      if (matchObj) {
        let dt = moment.tz(
          [matchObj[1], parseInt(matchObj[2]) - 1, matchObj[3], matchObj[4], matchObj[5], matchObj[6], matchObj[7]],
          'Europe/Moscow')
        timestamp = dt.valueOf()
      }
      if (timestamp) {
        resultArray.push({
          start: timestamp,
          end: timestamp + 600001,
          name: filename
        })
        let countElem = resultArray.length - 1
        if (countElem > 0) {
          resultArray[countElem - 1].end = timestamp
        }
      }
    }
    state.files = resultArray
  }
}

export default {
  state,
  getters,
  actions,
  mutations,
  namespaced: true
}
