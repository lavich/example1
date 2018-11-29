import { Http } from '@/api/http'

// state
const state = {
  thumbnail: null
}

// getters
const getters = {
  thumbnail: state => state.thumbnail
}

// actions
const actions = {
  set ({ state, commit }, newThumbnail) {
    commit('setThumbnail', newThumbnail)
  },
  upload ({ state, commit }, name) {
    return new Promise((resolve, reject) => {
      if (state.thumbnail === null) {
        resolve()
      }

      function dataURLtoBlob (dataurl) {
        let arr = dataurl.split(',')
        let mime = arr[0].match(/:(.*?);/)[1]
        let bstr = atob(arr[1])
        let n = bstr.length
        let u8arr = new Uint8Array(n)
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n)
        }
        return new Blob([u8arr], { type: mime })
      }

      let blob = dataURLtoBlob(state.thumbnail)

      let formData = new FormData()
      formData.append('file', blob)
      formData.append('name', name)

      Http.post('/api/thumbnails/', formData).then(resp => {
        console.log(resp)
        resolve()
      }).catch(resp => {
        console.log(resp)
        resolve()
      })
    })
  }
}

// mutations
const mutations = {
  setThumbnail (state, newThumbnail) {
    state.thumbnail = newThumbnail
  }
}

export default {
  state,
  getters,
  actions,
  mutations,
  namespaced: true
}
