import {
  CaseFunction,
  PreserveArrayBrackets,
  PreservedKeysCondition,
  PreserveSpecificKeys,
} from "./types";

export const preserveArrayBrackets: PreserveArrayBrackets = (fn) => {
  return (input, options?): ReturnType<ReturnType<PreserveArrayBrackets>> => {
    return fn(input, {
      stripRegexp: /[^A-Z0-9[\]]+/gi,
      ...options,
    });
  };
};

export const preserveSpecificKeys: PreserveSpecificKeys = (
  fn: CaseFunction,
  keys: string[] | PreservedKeysCondition
) => {
  const condition: PreservedKeysCondition =
    typeof keys === "function"
      ? keys
      : (input): boolean => keys.includes(input);

  return (input, options?): ReturnType<ReturnType<PreserveSpecificKeys>> => {
    return condition(input, options) ? input : fn(input, options);
  };
};
