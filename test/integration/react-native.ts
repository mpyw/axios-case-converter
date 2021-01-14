import { noCase } from "no-case";
import { createObjectTransformer } from "../../src/transformers";

let warn: Console["warn"];

beforeEach(() => {
  /* eslint-disable @typescript-eslint/ban-ts-ignore */
  // @ts-ignore
  global.Blob = require("blob-polyfill").Blob;
  // @ts-ignore
  global.navigator = { product: "ReactNative" };
  /* eslint-enable @typescript-eslint/ban-ts-ignore */
  require("formdata-polyfill");
  require("url-search-params-polyfill");
  warn = console.warn;
});

afterEach(() => {
  /* eslint-disable @typescript-eslint/ban-ts-ignore */
  // @ts-ignore
  delete global.Blob;
  // @ts-ignore
  delete global.navigator;
  // @ts-ignore
  delete global.FormData;
  // @ts-ignore
  delete global.URLSearchParams;
  /* eslint-enable @typescript-eslint/ban-ts-ignore */
  console.warn = warn;
  jest.resetModules();
});

test("it should warn about FormData.prototype.entries() in ReactNative", () => {
  console.warn = jest.fn();

  const entries = FormData.prototype.entries;
  delete FormData.prototype.entries;
  createObjectTransformer(noCase)(new FormData());

  expect(console.warn).toBeCalledWith(
    "Be careful that FormData cannot be transformed on React Native. If you intentionally implemented, ignore this kind of warning: https://facebook.github.io/react-native/docs/debugging.html"
  );
  FormData.prototype.entries = entries;
});

test("it should not warn about FormData.prototype.delete() when overwriting disabled in ReactNative", () => {
  console.warn = jest.fn();

  const delete_ = FormData.prototype.delete;
  delete FormData.prototype.delete;
  createObjectTransformer(noCase)(new FormData());

  expect(console.warn).not.toBeCalled();
  FormData.prototype.delete = delete_;
});

test("it should warn about FormData.prototype.delete() when overwriting enabled in ReactNative", () => {
  console.warn = jest.fn();

  const delete_ = FormData.prototype.delete;
  delete FormData.prototype.delete;
  createObjectTransformer(noCase)(new FormData(), { overwrite: true });

  expect(console.warn).toBeCalledWith(
    "Be careful that FormData cannot be transformed on React Native. If you intentionally implemented, ignore this kind of warning: https://facebook.github.io/react-native/docs/debugging.html"
  );
  FormData.prototype.delete = delete_;
});

test("it should warn about URLSearchParams.prototype.entries() in ReactNative", () => {
  console.warn = jest.fn();

  const entries = URLSearchParams.prototype.entries;
  delete URLSearchParams.prototype.entries;
  createObjectTransformer(noCase)(new URLSearchParams());

  expect(console.warn).toBeCalledWith(
    "Be careful that URLSearchParams cannot be transformed on React Native. If you intentionally implemented, ignore this kind of warning: https://facebook.github.io/react-native/docs/debugging.html"
  );
  URLSearchParams.prototype.entries = entries;
});

test("it should not warn about URLSearchParams.prototype.delete() when overwriting disabled in ReactNative", () => {
  console.warn = jest.fn();

  const delete_ = URLSearchParams.prototype.delete;
  delete URLSearchParams.prototype.delete;
  createObjectTransformer(noCase)(new URLSearchParams());

  expect(console.warn).not.toBeCalled();
  URLSearchParams.prototype.delete = delete_;
});

test("it should warn about URLSearchParams.prototype.delete() when overwriting enabled in ReactNative", () => {
  console.warn = jest.fn();

  const delete_ = URLSearchParams.prototype.delete;
  delete URLSearchParams.prototype.delete;
  createObjectTransformer(noCase)(new URLSearchParams(), { overwrite: true });

  expect(console.warn).toBeCalledWith(
    "Be careful that URLSearchParams cannot be transformed on React Native. If you intentionally implemented, ignore this kind of warning: https://facebook.github.io/react-native/docs/debugging.html"
  );
  URLSearchParams.prototype.delete = delete_;
});
