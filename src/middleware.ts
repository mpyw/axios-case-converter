import { createObjectTransformers } from './transformers';
import { isAxiosHeaders, isPlainObject } from './util';
import {
  ApplyCaseMiddleware,
  AxiosCaseMiddlewareOptions,
  CreateAxiosInterceptor,
  CreateAxiosRequestTransformer,
  CreateAxiosResponseTransformer,
  ObjectTransformer,
  TransformableObject,
} from './types';

export const createSnakeParamsInterceptor: CreateAxiosInterceptor = (
  options?
) => {
  const { snake } = createObjectTransformers(options?.caseFunctions);
  return (config): ReturnType<ReturnType<CreateAxiosInterceptor>> => {
    if (config.params) {
      config.params = snake(config.params, options);
    }
    return config;
  };
};
export const createSnakeRequestTransformer: CreateAxiosRequestTransformer = (
  options?
) => {
  const { snake, header } = createObjectTransformers(options?.caseFunctions);
  return (
    data: unknown,
    headers?: unknown
  ): ReturnType<ReturnType<CreateAxiosRequestTransformer>> => {
    overwriteHeadersOrNoop(headers, header, options, [
      'common',
      'delete',
      'get',
      'head',
      'post',
      'put',
      'patch',
    ]);
    return snake(data, options);
  };
};
export const createCamelResponseTransformer: CreateAxiosResponseTransformer = (
  options?
) => {
  const { camel } = createObjectTransformers(options?.caseFunctions);
  return (
    data: unknown,
    headers?: unknown
  ): ReturnType<ReturnType<CreateAxiosResponseTransformer>> => {
    overwriteHeadersOrNoop(headers, camel, options);
    return camel(data, options);
  };
};
const overwriteHeadersOrNoop = (
  headers: unknown,
  fn: ObjectTransformer,
  options?: AxiosCaseMiddlewareOptions,
  excludedKeys?: string[]
): void => {
  if (
    options?.ignoreHeaders ||
    (!isPlainObject(headers) && !isAxiosHeaders(headers))
  ) {
    return;
  }
  for (const [key, value] of Object.entries(headers)) {
    fn(value, { overwrite: true, ...options });
    if ((excludedKeys || []).includes(key)) {
      continue;
    }
    if (isAxiosHeaders(headers)) {
      headers.delete(key);
      headers.set(
        Object.keys(fn({ [key]: null }, options) as TransformableObject)[0],
        value,
        true
      );
    } else {
      delete headers[key];
      headers[
        Object.keys(fn({ [key]: null }, options) as TransformableObject)[0]
      ] = value;
    }
  }
};

export const applyCaseMiddleware: ApplyCaseMiddleware = (axios, options?) => {
  axios.defaults.transformRequest = [
    options?.caseMiddleware?.requestTransformer ||
      createSnakeRequestTransformer(options),
    ...(Array.isArray(axios.defaults.transformRequest)
      ? axios.defaults.transformRequest
      : axios.defaults.transformRequest !== undefined
      ? [axios.defaults.transformRequest]
      : []),
  ];
  axios.defaults.transformResponse = [
    ...(Array.isArray(axios.defaults.transformResponse)
      ? axios.defaults.transformResponse
      : axios.defaults.transformResponse !== undefined
      ? [axios.defaults.transformResponse]
      : []),
    options?.caseMiddleware?.responseTransformer ||
      createCamelResponseTransformer(options),
  ];
  axios.interceptors.request.use(
    options?.caseMiddleware?.requestInterceptor ||
      createSnakeParamsInterceptor(options)
  );
  return axios;
};
