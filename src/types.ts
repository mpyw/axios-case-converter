import { Options as NoCaseOptions } from 'camel-case';
import {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosRequestTransformer,
  AxiosResponseTransformer,
  AxiosRequestHeaders,
  AxiosInterceptorManager,
} from 'axios';

/** string transformers (change-case functions) */
export interface CaseFunction {
  (input: string, options?: NoCaseOptions): string;
}
export type CaseFunctionTypes = 'snake' | 'camel' | 'header';
export type CaseFunctions = {
  [K in CaseFunctionTypes]: CaseFunction;
};

/** decorators for string transformers */
export interface ApplyCaseOptions {
  (fn: CaseFunction, options?: NoCaseOptions): CaseFunction;
}
export interface PreserveSpecificKeys {
  (fn: CaseFunction, keys: string[] | PreservedKeysCondition): CaseFunction;
}

/** objects which can be handled in object transformers */
export interface TransformableObject {
  [key: string]: unknown;
}
export type Transformable = (
  | unknown[]
  | Record<string | number, unknown>
  | FormData
  | URLSearchParams
) &
  TransformableObject;

/** object transformers and their factories */
export interface PreservedKeysCondition {
  (input: string, options?: NoCaseOptions): boolean;
}
export type ObjectTransformerOptions = {
  overwrite?: boolean;
  preservedKeys?: string[] | PreservedKeysCondition;
  caseOptions?: NoCaseOptions;
};
export interface ObjectTransformer {
  (data: unknown, options?: ObjectTransformerOptions): unknown;
}
export type ObjectTransformers = {
  [K in CaseFunctionTypes]: ObjectTransformer;
};
export interface CreateObjectTransformer {
  (fn: CaseFunction): ObjectTransformer;
}
export interface CreateObjectTransformerOf {
  (
    type: CaseFunctionTypes,
    options?: Partial<CaseFunctions>
  ): ObjectTransformer;
}
export interface CreateObjectTransformers {
  (options?: Partial<CaseFunctions>): ObjectTransformers;
}

/** converters for axios and their factories */
export type AxiosCaseMiddlewareOptions = Omit<
  ObjectTransformerOptions,
  'overwrite'
> & {
  caseFunctions?: Partial<CaseFunctions>;
  ignoreHeaders?: boolean;
  ignoreParams?: boolean;
};
export type AxiosInterceptor<V> = NonNullable<
  Parameters<AxiosInterceptorManager<V>['use']>[0]
>;
export type AxiosRequestInterceptor = AxiosInterceptor<
  AxiosRequestConfig & {
    headers: AxiosRequestHeaders;
  }
>;
export interface CreateAxiosInterceptor<V> {
  (options?: AxiosCaseMiddlewareOptions): AxiosInterceptor<V>;
}
export interface CreateAxiosRequestInterceptor {
  (options?: AxiosCaseMiddlewareOptions): AxiosRequestInterceptor;
}
export interface CreateAxiosRequestTransformer {
  (options?: AxiosCaseMiddlewareOptions): AxiosRequestTransformer;
}
export interface CreateAxiosResponseTransformer {
  (options?: AxiosCaseMiddlewareOptions): AxiosResponseTransformer;
}

/** converter applier */
export type ApplyCaseMiddlewareOptions = AxiosCaseMiddlewareOptions & {
  caseMiddleware?: {
    requestTransformer?: AxiosRequestTransformer;
    responseTransformer?: AxiosResponseTransformer;
    requestInterceptor?: AxiosRequestInterceptor;
  };
};
export interface ApplyCaseMiddleware {
  (axios: AxiosInstance, options?: ApplyCaseMiddlewareOptions): AxiosInstance;
}
