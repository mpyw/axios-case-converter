import { header as ccHeader } from 'change-case'
import { snake, camel, header } from './transform'

export const snakeParams = config => {
  if (config.params) {
    config.params = snake(config.params)
  }
  return config
}
export const snakeRequest = (data, headers) => {
  for (const [key, value] of Object.entries(headers)) {
    header(value, true)
    if (!['common', 'delete', 'get', 'head', 'post', 'put', 'patch'].includes(key)) {
      delete headers[key]
      headers[ccHeader(key)] = value
    }
  }
  return snake(data)
}
export const camelResponse = (data, headers) => {
  camel(headers, true)
  return camel(data)
}

const applyConverters = axios => {
  axios.defaults.transformRequest.unshift(snakeRequest)
  axios.defaults.transformResponse.push(camelResponse)
  axios.interceptors.request.use(snakeParams)
  return axios
}

export default applyConverters
