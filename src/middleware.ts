import { createObjectTransformers } from './transformers';
import { isPlainObject } from './util';
import {
  ApplyCaseMiddleware,
  CreateAxiosInterceptor,
  CreateAxiosRequestTransformer,
  CreateAxiosResponseTransformer,
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
    if (!options?.ignoreHeaders && isPlainObject(headers)) {
      for (const [key, value] of Object.entries(headers)) {
        header(value, { overwrite: true, ...options });
        if (
          !['common', 'delete', 'get', 'head', 'post', 'put', 'patch'].includes(
            key
          )
        ) {
          delete headers[key];
          headers[
            Object.keys(
              header({ [key]: null }, options) as TransformableObject
            )[0]
          ] = value;
        }
      }
    }
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
    if (!options?.ignoreHeaders) {
      camel(headers, { overwrite: true, ...options });
    }
    return camel(data, options);
  };
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
