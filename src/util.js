export const isURLSearchParams = value => typeof URLSearchParams !== 'undefined' && value instanceof URLSearchParams
export const isFormData = value => typeof FormData !== 'undefined' && value instanceof FormData
export const isPlainObject = value => typeof value === 'object' && value !== null && Object.prototype.toString.call(value) === '[object Object]'
