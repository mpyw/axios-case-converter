import { camelCase as camelCaseString } from 'camel-case';
import { snakeCase as snakeCaseString } from 'snake-case';
import { headerCase as headerCaseString } from 'header-case';
import { applyCaseOptions, preserveSpecificKeys } from './decorators';
import { isFormData, isTransformable, isURLSearchParams } from './util';
import {
  CaseFunction,
  CaseFunctions,
  CaseFunctionTypes,
  CreateObjectTransformer,
  CreateObjectTransformerOf,
  CreateObjectTransformers,
  ObjectTransformerOptions,
  ObjectTransformers,
  Transformable,
} from './types';

const caseFunctions: CaseFunctions = {
  snake: snakeCaseString,
  camel: camelCaseString,
  header: headerCaseString,
};

const transformObjectUsingCallbackRecursive = (
  data: unknown,
  fn: CaseFunction,
  overwrite: ObjectTransformerOptions['overwrite']
): unknown => {
  if (!isTransformable(data)) {
    return data;
  }

  /* eslint-disable no-console */
  // Check FormData/URLSearchParams compatibility
  if (
    (isFormData(data) || isURLSearchParams(data)) &&
    (!data.entries || (overwrite && !data.delete))
  ) {
    const type = isFormData(data) ? 'FormData' : 'URLSearchParams';
    const polyfill = isFormData(data)
      ? 'https://github.com/jimmywarting/FormData'
      : 'https://github.com/jerrybendy/url-search-params-polyfill';
    if (
      typeof navigator !== 'undefined' &&
      navigator.product === 'ReactNative'
    ) {
      // You cannot transform FormData/URLSearchParams on React Native
      console.warn(
        `Be careful that ${type} cannot be transformed on React Native. If you intentionally implemented, ignore this kind of warning: https://facebook.github.io/react-native/docs/debugging.html`
      );
    } else {
      if (!data.entries) {
        // You need to polyfill `entries` method
        console.warn(
          `You must use polyfill of ${type}.prototype.entries() on Internet Explorer or Safari: ${polyfill}`
        );
      }
      if (overwrite && !data.delete) {
        // You need to polyfill `delete` method for overwriting
        console.warn(
          `You must use polyfill of ${type}.prototype.delete() on Internet Explorer or Safari: ${polyfill}`
        );
      }
    }
    return data;
  }
  /* eslint-enable no-console */

  const prototype = Object.getPrototypeOf(data);

  // Storage of new values.
  // New instances are created when overwriting is disabled.
  const store: Transformable = overwrite
    ? data
    : !prototype
    ? Object.create(null)
    : new prototype.constructor();

  // We need to clean up all entries before overwriting.
  let series:
    | Iterable<[unknown, unknown]>
    | IterableIterator<[unknown, unknown]>;
  if (isFormData(data) || isURLSearchParams(data)) {
    // Create native iterator from FormData/URLSearchParams
    series = data.entries();
    if (overwrite) {
      // When overwriting, native iterator needs to be copied as array.
      series = [...series];
      for (const [key] of series) {
        data.delete(key as string);
      }
    }
  } else {
    // Create array from objects
    series = Object.entries(data);
    // Array keys never change, so we don't need to clean up
    if (overwrite && !Array.isArray(data)) {
      for (const [key] of series) {
        delete data[key as string];
      }
    }
  }

  for (const [key, value] of series) {
    if (isFormData(store) || isURLSearchParams(store)) {
      store.append(fn(key as string), value as string & File);
    } else if (key !== '__proto__') {
      store[fn(typeof key === 'string' ? key : `${key}`)] =
        transformObjectUsingCallbackRecursive(value, fn, overwrite);
    }
  }
  return store;
};
const transformObjectUsingCallback = (
  data: unknown,
  fn: CaseFunction,
  options?: ObjectTransformerOptions
): unknown => {
  fn = applyCaseOptions(fn, {
    stripRegexp: /[^A-Z0-9[\]]+/gi,
    ...options?.caseOptions,
  });
  if (options?.preservedKeys) {
    fn = preserveSpecificKeys(fn, options.preservedKeys);
  }
  return transformObjectUsingCallbackRecursive(
    data,
    fn,
    options?.overwrite || false
  );
};

export const createObjectTransformer: CreateObjectTransformer = (fn) => {
  return (data, options): ReturnType<ReturnType<CreateObjectTransformer>> => {
    return transformObjectUsingCallback(data, fn, options);
  };
};
export const createObjectTransformerOf: CreateObjectTransformerOf = (
  functionName,
  options
) => {
  return createObjectTransformer(
    options?.[functionName] || caseFunctions[functionName]
  );
};
export const createObjectTransformers: CreateObjectTransformers = (options) => {
  const functionNames = Object.keys(caseFunctions) as CaseFunctionTypes[];
  const objectTransformers = {} as ObjectTransformers;
  for (const functionName of functionNames) {
    objectTransformers[functionName] = createObjectTransformerOf(
      functionName,
      options
    );
  }
  return objectTransformers;
};
