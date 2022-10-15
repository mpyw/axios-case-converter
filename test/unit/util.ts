import axios from 'axios';
import {
  isAxiosHeaders,
  isFormData,
  isPlainObject,
  isTransformable,
  isURLSearchParams,
} from '../../src/util';
import { newAxiosHeadersFrom } from '../axios-headers-dirty-hacks';

/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/ban-ts-comment */

beforeEach(async () => {
  // @ts-ignore
  global.Blob = require('blob-polyfill').Blob;
  require('url-search-params-polyfill');
  require('formdata-polyfill');
});

afterEach(() => {
  // @ts-ignore
  delete global.Blob;
  // @ts-ignore
  delete global.FormData;
  // @ts-ignore
  delete global.URLSearchParams;
  jest.resetModules();
});

test('it should correctly handle URLSearchParams', () => {
  expect(isURLSearchParams(new URLSearchParams())).toBe(true);
  expect(isFormData(new URLSearchParams())).toBe(false);
  expect(isPlainObject(new URLSearchParams())).toBe(false);
  expect(isTransformable(new URLSearchParams())).toBe(true);
  expect(isAxiosHeaders(new URLSearchParams())).toBe(false);
});

test('it should correctly handle FormData', () => {
  expect(isURLSearchParams(new FormData())).toBe(false);
  expect(isFormData(new FormData())).toBe(true);
  expect(isPlainObject(new FormData())).toBe(false);
  expect(isTransformable(new FormData())).toBe(true);
  expect(isAxiosHeaders(new FormData())).toBe(false);
});

test('it should correctly handle plain objects', () => {
  expect(isURLSearchParams({})).toBe(false);
  expect(isFormData({})).toBe(false);
  expect(isPlainObject({})).toBe(true);
  expect(isTransformable({})).toBe(true);
  expect(isAxiosHeaders({})).toBe(false);
});

test('it should correctly handle plain objects without prototype', () => {
  expect(isURLSearchParams(Object.create(null))).toBe(false);
  expect(isFormData(Object.create(null))).toBe(false);
  expect(isPlainObject(Object.create(null))).toBe(true);
  expect(isTransformable(Object.create(null))).toBe(true);
  expect(isAxiosHeaders(Object.create(null))).toBe(false);
});

test('it should correctly handle class instances', () => {
  expect(isURLSearchParams(new (class {})())).toBe(false);
  expect(isFormData(new (class {})())).toBe(false);
  expect(isPlainObject(new (class {})())).toBe(false);
  expect(isTransformable(new (class {})())).toBe(false);
  expect(isAxiosHeaders(new (class {})())).toBe(false);
});

if (axios.VERSION < '1') {
  test.skip('it should correctly handle AxiosHeaders', () => {
    //
  });
} else {
  test('it should correctly handle AxiosHeaders', () => {
    expect(isURLSearchParams(newAxiosHeadersFrom())).toBe(false);
    expect(isFormData(newAxiosHeadersFrom())).toBe(false);
    expect(isPlainObject(newAxiosHeadersFrom())).toBe(false);
    expect(isTransformable(newAxiosHeadersFrom())).toBe(false);
    expect(isAxiosHeaders(newAxiosHeadersFrom())).toBe(true);
  });
}

test('it should correctly handle string', () => {
  expect(isURLSearchParams('foo')).toBe(false);
  expect(isFormData('foo')).toBe(false);
  expect(isPlainObject('foo')).toBe(false);
  expect(isTransformable('foo')).toBe(false);
  expect(isAxiosHeaders('foo')).toBe(false);
});

test('it should correctly handle null', () => {
  expect(isURLSearchParams(null)).toBe(false);
  expect(isFormData(null)).toBe(false);
  expect(isPlainObject(null)).toBe(false);
  expect(isTransformable(null)).toBe(false);
  expect(isAxiosHeaders(null)).toBe(false);
});

test('it should correctly handle undefined', () => {
  expect(isURLSearchParams(undefined)).toBe(false);
  expect(isFormData(undefined)).toBe(false);
  expect(isPlainObject(undefined)).toBe(false);
  expect(isTransformable(undefined)).toBe(false);
  expect(isAxiosHeaders(undefined)).toBe(false);
});
