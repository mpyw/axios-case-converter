import {
  PreserveArrayBrackets,
  PreserveSpecificKeys,
  Transformer,
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
  fn: Transformer,
  keys: string[]
) => {
  return (input, options?): ReturnType<ReturnType<PreserveSpecificKeys>> => {
    return keys.includes(input) ? input : fn(input, options);
  };
};
