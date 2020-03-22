import { Transformer } from "./types";

export const preserveArrayBrackets = (fn: Transformer): Transformer => {
  return (
    input: Parameters<Transformer>[0],
    options?: Parameters<Transformer>[1]
  ): ReturnType<Transformer> => {
    return fn(input, {
      stripRegexp: /[^A-Z0-9[\]]+/gi,
      ...options,
    });
  };
};

export const preserveSpecificKeys = (
  fn: Transformer,
  keys: string[]
): Transformer => {
  return (
    input: Parameters<Transformer>[0],
    options?: Parameters<Transformer>[1]
  ): ReturnType<Transformer> => {
    return keys.includes(input) ? input : fn(input, options);
  };
};
