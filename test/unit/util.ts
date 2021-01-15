import {
  isFormData,
  isPlainObject,
  isTransformable,
  isURLSearchParams,
} from "../../src/util";

beforeEach(async () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  global.Blob = require("blob-polyfill").Blob;
  require("url-search-params-polyfill");
  require("formdata-polyfill");
});

afterEach(() => {
  /* eslint-disable @typescript-eslint/ban-ts-ignore */
  // @ts-ignore
  delete global.Blob;
  // @ts-ignore
  delete global.FormData;
  // @ts-ignore
  delete global.URLSearchParams;
  /* eslint-enable @typescript-eslint/ban-ts-ignore */
  jest.resetModules();
});

test("it should correctly handle URLSearchParams", () => {
  expect(isURLSearchParams(new URLSearchParams())).toBe(true);
  expect(isFormData(new URLSearchParams())).toBe(false);
  expect(isPlainObject(new URLSearchParams())).toBe(false);
  expect(isTransformable(new URLSearchParams())).toBe(true);
});

test("it should correctly handle FormData", () => {
  expect(isURLSearchParams(new FormData())).toBe(false);
  expect(isFormData(new FormData())).toBe(true);
  expect(isPlainObject(new FormData())).toBe(false);
  expect(isTransformable(new FormData())).toBe(true);
});

test("it should correctly handle plain objects", () => {
  expect(isURLSearchParams({})).toBe(false);
  expect(isFormData({})).toBe(false);
  expect(isPlainObject({})).toBe(true);
  expect(isTransformable({})).toBe(true);
});

test("it should correctly handle arrays", () => {
  expect(isURLSearchParams([])).toBe(false);
  expect(isFormData([])).toBe(false);
  expect(isPlainObject([])).toBe(false);
  expect(isTransformable([])).toBe(true);
});

test("it should correctly handle string", () => {
  expect(isURLSearchParams("foo")).toBe(false);
  expect(isFormData("foo")).toBe(false);
  expect(isPlainObject("foo")).toBe(false);
  expect(isTransformable("foo")).toBe(false);
});
