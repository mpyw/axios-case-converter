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
  // Simulate React Native, where FormData/URLSearchParams cannot be transformed.
  // Node's native globals are used; each test strips the relevant prototype
  // method to reproduce the missing capability. The methods are snapshotted here
  // and restored in afterEach so a failing assertion cannot leak a mutated
  // prototype into later tests.
  setGlobal('navigator', { product: 'ReactNative' });
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
    'Be careful that FormData cannot be transformed on React Native. If you intentionally implemented, ignore this kind of warning: https://facebook.github.io/react-native/docs/debugging.html'
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
    'Be careful that FormData cannot be transformed on React Native. If you intentionally implemented, ignore this kind of warning: https://facebook.github.io/react-native/docs/debugging.html'
  );
});

test('it should warn about URLSearchParams.prototype.entries() in ReactNative', () => {
  console.warn = vi.fn();

  // @ts-ignore
  delete URLSearchParams.prototype.entries;
  createObjectTransformer(noCase)(new URLSearchParams());

  expect(console.warn).toHaveBeenCalledWith(
    'Be careful that URLSearchParams cannot be transformed on React Native. If you intentionally implemented, ignore this kind of warning: https://facebook.github.io/react-native/docs/debugging.html'
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
    'Be careful that URLSearchParams cannot be transformed on React Native. If you intentionally implemented, ignore this kind of warning: https://facebook.github.io/react-native/docs/debugging.html'
  );
});
