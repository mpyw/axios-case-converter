import {
  ApplyCaseOptions,
  CaseFunction,
  PreservedKeysCondition,
  PreserveSpecificKeys,
} from './types';

export const applyCaseOptions: ApplyCaseOptions = (fn, defaultOptions) => {
  return (input, options?): ReturnType<ReturnType<ApplyCaseOptions>> => {
    return fn(input, {
      ...defaultOptions,
      ...options,
    });
  };
};

export const preserveSpecificKeys: PreserveSpecificKeys = (
  fn: CaseFunction,
  keys: string[] | PreservedKeysCondition
) => {
  const condition: PreservedKeysCondition =
    typeof keys === 'function'
      ? keys
      : (input): boolean => keys.includes(input);

  return (input, options?): ReturnType<ReturnType<PreserveSpecificKeys>> => {
    return condition(input, options) ? input : fn(input, options);
  };
};
