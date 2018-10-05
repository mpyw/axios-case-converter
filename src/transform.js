import {
  camel as ccCamel,
  snake as ccSnake,
  header as ccHeader,
} from 'change-case'
import { isPlainObject, isURLSearchParams, isFormData } from './util'

const transform = (data, fn, overwrite = false) => {
  if (!Array.isArray(data) && !isPlainObject(data) && !isFormData(data) && !isURLSearchParams(data)) {
    return data
  }

  /* eslint-disable no-console */
  if (isFormData(data) && !data.entries) {
    if (navigator.product === 'ReactNative') {
      console.warn('Be careful that FormData cannot be transformed on React Native. If you intentionally implemented, ignore this kind of warning: https://facebook.github.io/react-native/docs/debugging.html')
    } else {
      console.warn('You must use polyfill of FormData.prototype.entries() on Internet Explorer or Safari: https://github.com/jimmywarting/FormData')
    }
    return data
  }
  /* eslint-enable no-console */

  const prototype = Object.getPrototypeOf(data)
  const store = overwrite ? data : prototype ? new prototype.constructor : Object.create(null)
  for (const [key, value] of prototype && prototype.entries ? prototype.entries.call(data) : Object.entries(data)) {
    if (prototype && prototype.append) {
      prototype.append.call(store, key.replace(/[^[\]]+/g, k => fn(k)), transform(value, fn))
    } else if (key !== '__proto__') {
      store[fn(key)] = transform(value, fn)
    }
  }
  return store
}

export const createTransform = fn => (data, overwrite = false) => transform(data, fn, overwrite)

export const snake = createTransform(ccSnake)
export const camel = createTransform(ccCamel)
export const header = createTransform(ccHeader)

export default transform
