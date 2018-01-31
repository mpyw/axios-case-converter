import isPlainObject from 'is-plain-object'
import {
  camel as ccCamel,
  snake as ccSnake,
  header as ccHeader,
} from 'change-case'
import { isURLSearchParams, isFormData } from './util'

const transform = (data, fn, overwrite = false) => {
  if (!Array.isArray(data) && !isPlainObject(data) && !isFormData(data) && !isURLSearchParams(data)) {
    return data
  }
  if (isFormData(data) && !data.entries) {
    throw new Error('You must use polyfill of FormData.prototype.entries(): https://github.com/jimmywarting/FormData')
  }
  const store = overwrite ? data : new data.constructor
  for (const [key, value] of data.entries ? data.entries(data) : Object.entries(data)) {
    if (store.append) {
      store.append(key.replace(/[^[\]]+/g, k => fn(k)), transform(value, fn))
    } else {
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
