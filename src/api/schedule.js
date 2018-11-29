import { Http } from './http'

var filter = function (search, durationMin) {
  return [
    {
      'or': [
        { 'name': 'duration', 'op': '>', 'val': durationMin },
        { 'name': 'duration', 'op': 'is_null' }
      ]
    },
    {
      'or': [
        { 'name': 'harris', 'op': 'like', 'val': '%' + search + '%' },
        { 'name': 'title', 'op': 'like', 'val': '%' + search + '%' }
      ]
    }
  ]
}

export default {
  get (data, cb) {
    Http
      .get('api/schedule', {
        params: {
          q: { 'filters': filter(data.search, data.durationMin), 'order_by': [{ field: 'start', direction: 'desc' }] },
          page: data.page,
          results_per_page: 30
        }
      })
      .then((response) => cb(response.data))
      .catch(function (error) {
        console.error(error)
      })
  }
}
