import axios from 'axios'
import {config} from './config'

const instance = axios.create({
  baseURL: config.backendAPIURL
})

instance.interceptors.request.use((requestConfig) => {
  // console.log('url: ', requestConfig.url);
  if (requestConfig.url.includes(config.backendAPIURL)) {
    const localSavedJwtToken = localStorage.getItem(config.localStorageKey.login)
    if (localSavedJwtToken) {
      requestConfig.headers.Authorization = 'Bearer ' + localStorage.getItem(config.localStorageKey.login)
    }
  }
  return requestConfig
})

instance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response.status === 401 || error.response.status === 419
      || error.response.status === 440 ) {
        // console.log(error.response.request.responseURL);
        if (error.response.request.responseURL.includes(config.backendAPIURL)) {
          console.log('Backend 401/419/440 response received')
          // console.log(error.response);
          localStorage.removeItem(config.localStorageKey.login)
          location.reload()
        }
    }
    return Promise.reject(error)
  }
)

export default instance