import { Http } from './http'

export default {
  get (data, cb) {
    Http
      .get('api/videos/', { params: data })
      .then((response) => cb(response.data))
      .catch((error) => {
        console.error(error)
        cb()
      })
  },
  post (formData, cb) {
    Http
      .post('api/videos/', formData)
      .then((response) => cb(response.data))
      .catch((error) => cb(error))
  },
  put (data, cb) {
    Http
      .put('api/videos/' + data.id, { folder: data.folder })
      .then((response) => cb(response))
      .catch((error) => cb(error))
  },
  delete (data, cb) {
    Http
      .delete('api/videos/' + data.id)
      .then((response) => cb(response.data))
      .catch((error) => cb(error))
  },
  getFolders (cb) {
    Http
      .get('api/videos/folders/')
      .then((response) => cb(response.data))
      .catch((error) => cb(error))
  }
}
