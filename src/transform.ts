import { camelCase as camelCaseString } from "camel-case";
import { snakeCase as snakeCaseString } from "snake-case";
import { headerCase as headerCaseString } from "header-case";
import { preserveArrayBrackets, preserveSpecificKeys } from "./decorators";
import { isFormData, isTransformable } from "./util";
import {
  CreateTransform,
  CreateTransformOf,
  CreateTransforms,
  Transformable,
  CaseFunction,
  ObjectTransformerOptions,
  TransformUsingCallback,
} from "./types";

const transformRecursive = (
  data: unknown,
  fn: CaseFunction,
  overwrite: ObjectTransformerOptions["overwrite"]
): unknown => {
  if (!isTransformable(data)) {
    return data;
  }

  /* eslint-disable no-console */
  if (isFormData(data) && !data.entries) {
    if (navigator.product === "ReactNative") {
      console.warn(
        "Be careful that FormData cannot be transformed on React Native. If you intentionally implemented, ignore this kind of warning: https://facebook.github.io/react-native/docs/debugging.html"
      );
    } else {
      console.warn(
        "You must use polyfill of FormData.prototype.entries() on Internet Explorer or Safari: https://github.com/jimmywarting/FormData"
      );
    }
    return data;
  }
  /* eslint-enable no-console */

  const prototype = Object.getPrototypeOf(data);

  const store: Transformable = overwrite
    ? data
    : !prototype
    ? Object.create(null)
    : new prototype.constructor();

  for (const [key, value] of prototype?.entries?.call(data) ||
    Object.entries(data)) {
    if (prototype?.append) {
      prototype.append.call(
        store,
        typeof key === "string" ? fn(key) : key,
        transformRecursive(value, fn, overwrite)
      );
    } else if (key !== "__proto__") {
      store[fn(typeof key === "string" ? key : `${key}`)] = transformRecursive(
        value,
        fn,
        overwrite
      );
    }
  }
  return store;
};

const transform: TransformUsingCallback = (data, fn, options) => {
  // Backward compatibility
  options = typeof options === "boolean" ? { overwrite: options } : options;

  const composedFn = preserveSpecificKeys(
    preserveArrayBrackets(fn),
    options?.preservedKeys || []
  );
  return transformRecursive(data, composedFn, options?.overwrite || false);
};

export const createTransform: CreateTransform = (fn) => {
  return (data, options): ReturnType<ReturnType<CreateTransform>> => {
    return transform(data, fn, options);
  };
};

export const snake = createTransform(snakeCaseString);
export const camel = createTransform(camelCaseString);
export const header = createTransform(headerCaseString);

export const createTransformOf: CreateTransformOf = (functionName, options) => {
  const fn = options?.[functionName];
  return fn ? createTransform(fn) : { snake, camel, header }[functionName];
};
export const createTransforms: CreateTransforms = (options) => {
  const transforms: ReturnType<CreateTransforms> = { snake, camel, header };
  const functionNames = Object.keys(transforms) as (keyof typeof transforms)[];
  for (const functionName of functionNames) {
    transforms[functionName] = createTransformOf(functionName, options);
  }
  return transforms;
};

export default transform;
