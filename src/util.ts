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
  if (value == null) {
    return false;
  }
  const proto = Object.getPrototypeOf(value);
  return proto === null || proto === Object.prototype;
};

export const isTransformable = (value: unknown): value is Transformable => {
  return (
    Array.isArray(value) ||
    isPlainObject(value) ||
    isFormData(value) ||
    isURLSearchParams(value)
  );
};

// Dirty hack for unexported AxiosHeaders.
// Don't handle it as Transformable to reduce the scope of the impact.
export const isAxiosHeaders = (value: unknown): value is AxiosHeaders => {
  if (value == null) {
    return false;
  }
  return Object.getPrototypeOf(value)?.constructor?.name === 'AxiosHeaders';
};
interface AxiosHeaders {
  set(headerName: string, value: string, rewrite: boolean): unknown;
  delete(header: string): boolean;
}
