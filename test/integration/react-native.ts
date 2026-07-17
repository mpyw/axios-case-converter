// noinspection JSConstantReassignment

import { noCase } from 'no-case';
import { createObjectTransformer } from '../../src/transformers';
import { restoreGlobals, setGlobal } from '../global-env';

let warn: Console['warn'];

beforeEach(() => {
  // Simulate React Native, where FormData/URLSearchParams cannot be transformed.
  // Node's native globals are used; each test strips the relevant prototype
  // method to reproduce the missing capability.
  setGlobal('navigator', { product: 'ReactNative' });
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
    'Be careful that FormData cannot be transformed on React Native. If you intentionally implemented, ignore this kind of warning: https://facebook.github.io/react-native/docs/debugging.html'
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
    'Be careful that FormData cannot be transformed on React Native. If you intentionally implemented, ignore this kind of warning: https://facebook.github.io/react-native/docs/debugging.html'
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
    'Be careful that URLSearchParams cannot be transformed on React Native. If you intentionally implemented, ignore this kind of warning: https://facebook.github.io/react-native/docs/debugging.html'
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
    'Be careful that URLSearchParams cannot be transformed on React Native. If you intentionally implemented, ignore this kind of warning: https://facebook.github.io/react-native/docs/debugging.html'
  );
  URLSearchParams.prototype.delete = delete_;
});
