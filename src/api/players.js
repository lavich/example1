import { Http } from './http'

export default {
  get (data, cb) {
    Http
      .get('api/players/', { params: data })
      .then((response) => cb(response.data))
      .catch((error) => {
        console.error(error)
        cb()
      })
  },
  put (data, cb) {
    Http
      .put('api/players/' + data.id, { folder: data.folder })
      .then((response) => cb(response.data))
      .catch((error) => cb(error))
  },
  delete (data, cb) {
    Http
      .delete('api/players/' + data.id)
      .then((response) => cb(response.data))
      .catch((error) => cb(error))
  }
}
