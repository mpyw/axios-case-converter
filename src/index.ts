import { AxiosTransformer } from "axios";
import { camel, header, snake } from "./transform";
import { isPlainObject } from "./util";
import {
  ApplyConverters,
  AxiosInterceptor,
  CreateAxiosInterceptor,
  CreateAxiosTransformer,
  TransformableObject,
} from "./types";

export const createSnakeParams: CreateAxiosInterceptor = (options?) => {
  return (config): ReturnType<ReturnType<CreateAxiosInterceptor>> => {
    if (config.params) {
      config.params = snake(config.params, options);
    }
    return config;
  };
};
export const createSnakeRequest: CreateAxiosTransformer = (options?) => {
  return (
    data: unknown,
    headers?: unknown
  ): ReturnType<ReturnType<CreateAxiosTransformer>> => {
    if (isPlainObject(headers)) {
      for (const [key, value] of Object.entries(headers)) {
        header(value, { overwrite: true, ...options });
        if (
          !["common", "delete", "get", "head", "post", "put", "patch"].includes(
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
export const createCamelResponse: CreateAxiosTransformer = (options?) => {
  return (
    data: unknown,
    headers?: unknown
  ): ReturnType<ReturnType<CreateAxiosTransformer>> => {
    camel(headers, { overwrite: true, ...options });
    return camel(data, options);
  };
};

export const snakeParams: AxiosInterceptor = createSnakeParams();
export const snakeRequest: AxiosTransformer = createSnakeRequest();
export const camelResponse: AxiosTransformer = createCamelResponse();

const applyConverters: ApplyConverters = (axios, options?) => {
  axios.defaults.transformRequest = [
    options?.converters?.snakeRequest || createSnakeRequest(options),
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
    options?.converters?.camelResponse || createCamelResponse(options),
  ];
  axios.interceptors.request.use(
    options?.converters?.snakeParams || createSnakeParams(options)
  );
  return axios;
};

export default applyConverters;
export * from "./types";
