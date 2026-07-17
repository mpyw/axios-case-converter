// noinspection JSConstantReassignment

import { noCase } from 'no-case';
import { createObjectTransformer } from '../../src/transformers';
import { restoreGlobals, setGlobal } from '../global-env';

let warn: Console['warn'];

beforeEach(() => {
  // Simulate a non-React-Native browser (e.g. Internet Explorer / old Safari)
  // that ships FormData/URLSearchParams without the iterator helpers. Node's
  // native globals are used; each test strips the relevant prototype method to
  // reproduce the missing capability.
  setGlobal('navigator', { product: 'Gecko' });
  warn = console.warn;
});

afterEach(() => {
  restoreGlobals();
  console.warn = warn;
});

test('it should warn about FormData.prototype.entries() in ReactNative', () => {
  console.warn = vi.fn();

  // @ts-ignore
  const entries = FormData.prototype.entries;
  // @ts-ignore
  delete FormData.prototype.entries;
  createObjectTransformer(noCase)(new FormData());

  expect(console.warn).toHaveBeenCalledWith(
    'You must use polyfill of FormData.prototype.entries() on Internet Explorer or Safari: https://github.com/jimmywarting/FormData'
  );
  // @ts-ignore
  FormData.prototype.entries = entries;
});

test('it should not warn about FormData.prototype.delete() when overwriting disabled in ReactNative', () => {
  console.warn = vi.fn();

  const delete_ = FormData.prototype.delete;
  // @ts-ignore
  delete FormData.prototype.delete;
  createObjectTransformer(noCase)(new FormData());

  expect(console.warn).not.toHaveBeenCalled();
  FormData.prototype.delete = delete_;
});

test('it should warn about FormData.prototype.delete() when overwriting enabled in ReactNative', () => {
  console.warn = vi.fn();

  const delete_ = FormData.prototype.delete;
  // @ts-ignore
  delete FormData.prototype.delete;
  createObjectTransformer(noCase)(new FormData(), { overwrite: true });

  expect(console.warn).toHaveBeenCalledWith(
    'You must use polyfill of FormData.prototype.delete() on Internet Explorer or Safari: https://github.com/jimmywarting/FormData'
  );
  FormData.prototype.delete = delete_;
});

test('it should warn about URLSearchParams.prototype.entries() in ReactNative', () => {
  console.warn = vi.fn();

  // @ts-ignore
  const entries = URLSearchParams.prototype.entries;
  // @ts-ignore
  delete URLSearchParams.prototype.entries;
  createObjectTransformer(noCase)(new URLSearchParams());

  expect(console.warn).toHaveBeenCalledWith(
    'You must use polyfill of URLSearchParams.prototype.entries() on Internet Explorer or Safari: https://github.com/jerrybendy/url-search-params-polyfill'
  );
  // @ts-ignore
  URLSearchParams.prototype.entries = entries;
});

test('it should not warn about URLSearchParams.prototype.delete() when overwriting disabled in ReactNative', () => {
  console.warn = vi.fn();

  const delete_ = URLSearchParams.prototype.delete;
  // @ts-ignore
  delete URLSearchParams.prototype.delete;
  createObjectTransformer(noCase)(new URLSearchParams());

  expect(console.warn).not.toHaveBeenCalled();
  URLSearchParams.prototype.delete = delete_;
});

test('it should warn about URLSearchParams.prototype.delete() when overwriting enabled in ReactNative', () => {
  console.warn = vi.fn();

  const delete_ = URLSearchParams.prototype.delete;
  // @ts-ignore
  delete URLSearchParams.prototype.delete;
  createObjectTransformer(noCase)(new URLSearchParams(), { overwrite: true });

  expect(console.warn).toHaveBeenCalledWith(
    'You must use polyfill of URLSearchParams.prototype.delete() on Internet Explorer or Safari: https://github.com/jerrybendy/url-search-params-polyfill'
  );
  URLSearchParams.prototype.delete = delete_;
});
