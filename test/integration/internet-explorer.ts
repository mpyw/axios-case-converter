// noinspection JSConstantReassignment

import { noCase } from 'no-case';
import { createObjectTransformer } from '../../src/transformers';

let warn: Console['warn'];

/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/ban-ts-comment */

beforeEach(() => {
  // @ts-ignore
  global.Blob = require('blob-polyfill').Blob;
  // @ts-ignore
  global.navigator = { product: 'Gecko' };
  // @ts-ignore
  require('formdata-polyfill');
  require('url-search-params-polyfill');
  warn = console.warn;
});

afterEach(() => {
  // @ts-ignore
  delete global.Blob;
  // @ts-ignore
  delete global.navigator;
  // @ts-ignore
  delete global.FormData;
  // @ts-ignore
  delete global.URLSearchParams;
  console.warn = warn;
  jest.resetModules();
});

test('it should warn about FormData.prototype.entries() in ReactNative', () => {
  console.warn = jest.fn();

  // @ts-ignore
  const entries = FormData.prototype.entries;
  // @ts-ignore
  delete FormData.prototype.entries;
  createObjectTransformer(noCase)(new FormData());

  expect(console.warn).toBeCalledWith(
    'You must use polyfill of FormData.prototype.entries() on Internet Explorer or Safari: https://github.com/jimmywarting/FormData'
  );
  // @ts-ignore
  FormData.prototype.entries = entries;
});

test('it should not warn about FormData.prototype.delete() when overwriting disabled in ReactNative', () => {
  console.warn = jest.fn();

  const delete_ = FormData.prototype.delete;
  // @ts-ignore
  delete FormData.prototype.delete;
  createObjectTransformer(noCase)(new FormData());

  expect(console.warn).not.toBeCalled();
  FormData.prototype.delete = delete_;
});

test('it should warn about FormData.prototype.delete() when overwriting enabled in ReactNative', () => {
  console.warn = jest.fn();

  const delete_ = FormData.prototype.delete;
  // @ts-ignore
  delete FormData.prototype.delete;
  createObjectTransformer(noCase)(new FormData(), { overwrite: true });

  expect(console.warn).toBeCalledWith(
    'You must use polyfill of FormData.prototype.delete() on Internet Explorer or Safari: https://github.com/jimmywarting/FormData'
  );
  FormData.prototype.delete = delete_;
});

test('it should warn about URLSearchParams.prototype.entries() in ReactNative', () => {
  console.warn = jest.fn();

  // @ts-ignore
  const entries = URLSearchParams.prototype.entries;
  // @ts-ignore
  delete URLSearchParams.prototype.entries;
  createObjectTransformer(noCase)(new URLSearchParams());

  expect(console.warn).toBeCalledWith(
    'You must use polyfill of URLSearchParams.prototype.entries() on Internet Explorer or Safari: https://github.com/jerrybendy/url-search-params-polyfill'
  );
  // @ts-ignore
  URLSearchParams.prototype.entries = entries;
});

test('it should not warn about URLSearchParams.prototype.delete() when overwriting disabled in ReactNative', () => {
  console.warn = jest.fn();

  const delete_ = URLSearchParams.prototype.delete;
  // @ts-ignore
  delete URLSearchParams.prototype.delete;
  createObjectTransformer(noCase)(new URLSearchParams());

  expect(console.warn).not.toBeCalled();
  URLSearchParams.prototype.delete = delete_;
});

test('it should warn about URLSearchParams.prototype.delete() when overwriting enabled in ReactNative', () => {
  console.warn = jest.fn();

  const delete_ = URLSearchParams.prototype.delete;
  // @ts-ignore
  delete URLSearchParams.prototype.delete;
  createObjectTransformer(noCase)(new URLSearchParams(), { overwrite: true });

  expect(console.warn).toBeCalledWith(
    'You must use polyfill of URLSearchParams.prototype.delete() on Internet Explorer or Safari: https://github.com/jerrybendy/url-search-params-polyfill'
  );
  URLSearchParams.prototype.delete = delete_;
});
