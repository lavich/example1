import axios from 'axios'

// const baseURL = window.location.origin + window.location.pathname
const Http = axios.create({
  // baseURL: baseURL
  headers: { 'Access-Control-Allow-Origin': '*' }
})

export { Http }
