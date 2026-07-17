// noinspection JSConstantReassignment

import { noCase } from 'no-case';
import { createObjectTransformer } from '../../src/transformers';
import {
  captureMethod,
  restoreGlobals,
  restoreMethods,
  setGlobal,
} from '../global-env';

let warn: Console['warn'];

beforeEach(() => {
  // Simulate a non-React-Native browser (e.g. Internet Explorer / old Safari)
  // that ships FormData/URLSearchParams without the iterator helpers. Node's
  // native globals are used; each test strips the relevant prototype method to
  // reproduce the missing capability. The methods are snapshotted here and
  // restored in afterEach so a failing assertion cannot leak a mutated
  // prototype into later tests.
  setGlobal('navigator', { product: 'Gecko' });
  captureMethod(FormData.prototype, 'entries');
  captureMethod(FormData.prototype, 'delete');
  captureMethod(URLSearchParams.prototype, 'entries');
  captureMethod(URLSearchParams.prototype, 'delete');
  warn = console.warn;
});

afterEach(() => {
  restoreMethods();
  restoreGlobals();
  console.warn = warn;
});

test('it should warn about FormData.prototype.entries() in ReactNative', () => {
  console.warn = vi.fn();

  // @ts-ignore
  delete FormData.prototype.entries;
  createObjectTransformer(noCase)(new FormData());

  expect(console.warn).toHaveBeenCalledWith(
    'You must use polyfill of FormData.prototype.entries() on Internet Explorer or Safari: https://github.com/jimmywarting/FormData'
  );
});

test('it should not warn about FormData.prototype.delete() when overwriting disabled in ReactNative', () => {
  console.warn = vi.fn();

  // @ts-ignore
  delete FormData.prototype.delete;
  createObjectTransformer(noCase)(new FormData());

  expect(console.warn).not.toHaveBeenCalled();
});

test('it should warn about FormData.prototype.delete() when overwriting enabled in ReactNative', () => {
  console.warn = vi.fn();

  // @ts-ignore
  delete FormData.prototype.delete;
  createObjectTransformer(noCase)(new FormData(), { overwrite: true });

  expect(console.warn).toHaveBeenCalledWith(
    'You must use polyfill of FormData.prototype.delete() on Internet Explorer or Safari: https://github.com/jimmywarting/FormData'
  );
});

test('it should warn about URLSearchParams.prototype.entries() in ReactNative', () => {
  console.warn = vi.fn();

  // @ts-ignore
  delete URLSearchParams.prototype.entries;
  createObjectTransformer(noCase)(new URLSearchParams());

  expect(console.warn).toHaveBeenCalledWith(
    'You must use polyfill of URLSearchParams.prototype.entries() on Internet Explorer or Safari: https://github.com/jerrybendy/url-search-params-polyfill'
  );
});

test('it should not warn about URLSearchParams.prototype.delete() when overwriting disabled in ReactNative', () => {
  console.warn = vi.fn();

  // @ts-ignore
  delete URLSearchParams.prototype.delete;
  createObjectTransformer(noCase)(new URLSearchParams());

  expect(console.warn).not.toHaveBeenCalled();
});

test('it should warn about URLSearchParams.prototype.delete() when overwriting enabled in ReactNative', () => {
  console.warn = vi.fn();

  // @ts-ignore
  delete URLSearchParams.prototype.delete;
  createObjectTransformer(noCase)(new URLSearchParams(), { overwrite: true });

  expect(console.warn).toHaveBeenCalledWith(
    'You must use polyfill of URLSearchParams.prototype.delete() on Internet Explorer or Safari: https://github.com/jerrybendy/url-search-params-polyfill'
  );
});
