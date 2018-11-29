import { Http } from './http'

export default {
  post (data, cb) {
    Http
      .post('api/make_video/', data)
      .then((response) => cb(response.data))
      .catch((error) => cb(error))
  }
}
