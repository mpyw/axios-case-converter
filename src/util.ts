import { Transformable, TransformableObject } from './types';

export const isURLSearchParams = (value: unknown): value is URLSearchParams => {
  return (
    typeof URLSearchParams !== 'undefined' && value instanceof URLSearchParams
  );
};

export const isFormData = (value: unknown): value is FormData => {
  return typeof FormData !== 'undefined' && value instanceof FormData;
};

export const isPlainObject = (value: unknown): value is TransformableObject => {
  return (
    typeof value === 'object' &&
    value !== null &&
    Object.prototype.toString.call(value) === '[object Object]'
  );
};

export const isTransformable = (value: unknown): value is Transformable => {
  return (
    Array.isArray(value) ||
    isPlainObject(value) ||
    isFormData(value) ||
    isURLSearchParams(value)
  );
};
