import isPlainObject from 'is-plain-object'
import { camel, snake, header } from 'change-case'

const isURLSearchParams = value => typeof URLSearchParams !== 'undefined' && value instanceof URLSearchParams
const isFormData = value => typeof FormData !== 'undefined' && value instanceof FormData

const transform = (data, fn, overwrite = false) => {
  if (!Array.isArray(data) && !isPlainObject(data) && !isFormData(data) && !isURLSearchParams(data)) {
    return data
  }
  const store = overwrite ? data : new data.constructor
  for (const [key, value] of Object.entries(data)) {
    if (store.append) {
      store.append(fn(key), transform(value, fn))
    } else {
      store[fn(key)] = transform(value, fn)
    }
  }
  return store
}

export const snakizeRequest = (data, headers) => {
  for (const [key, value] of Object.entries(headers)) {
    const newValue = transform(value, header, true)
    if (!['common', 'delete', 'get', 'head', 'post', 'put', 'patch'].includes(key)) {
      delete headers[key]
      headers[header(key)] = newValue
    }
  }
  return transform(data, snake)
}
export const camelizeResponse = (data, headers) => {
  transform(headers, camel, true)
  return transform(data, camel)
}
export const snakizeRequestParams = config => {
  if (config.params) {
    config.params = transform(config.params, snake)
  }
  return config
}

const applyConverters = axios => {
  axios.defaults.transformRequest.unshift(snakizeRequest)
  axios.defaults.transformResponse.push(camelizeResponse)
  axios.interceptors.request.use(snakizeRequestParams)
  return axios
}

export default applyConverters
