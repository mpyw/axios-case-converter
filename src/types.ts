import { Options as NoCaseOptions } from "camel-case";
import { AxiosInstance, AxiosRequestConfig, AxiosTransformer } from "axios";

/** string transformers (change-case functions) */
export interface CaseFunction {
  (input: string, options?: NoCaseOptions): string;
}
export type CaseFunctionTypes = "snake" | "camel" | "header";
export type CaseFunctions = {
  [K in CaseFunctionTypes]: CaseFunction;
};

/** decorators for string transformers */
export interface PreserveArrayBrackets {
  (fn: CaseFunction): CaseFunction;
}
export interface PreserveSpecificKeys {
  (fn: CaseFunction, keys: string[] | PreservedKeysCondition): CaseFunction;
}

/** objects which can be handled in object transformers */
export interface TransformableObject {
  [key: string]: unknown;
}
export type Transformable = (unknown[] | object | FormData | URLSearchParams) &
  TransformableObject;

/** object transformers and their factories */
export interface PreservedKeysCondition {
  (input: string, options?: NoCaseOptions): boolean;
}
export type ObjectTransformerOptions = {
  overwrite?: boolean;
  preservedKeys?: string[] | PreservedKeysCondition;
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
export type AxiosCaseMiddlewareOptions = Omit<ObjectTransformerOptions, "overwrite"> & {
  caseFunctions?: Partial<CaseFunctions>;
  ignoreHeaders?: boolean;
};
export interface AxiosInterceptor {
  (config: AxiosRequestConfig): AxiosRequestConfig;
}
export interface CreateAxiosInterceptor {
  (options?: AxiosCaseMiddlewareOptions): AxiosInterceptor;
}
export interface CreateAxiosTransformer {
  (options?: AxiosCaseMiddlewareOptions): AxiosTransformer;
}

/** converter applier */
export type ApplyCaseMiddlewareOptions = AxiosCaseMiddlewareOptions & {
  converters?: {
    snakeRequest?: AxiosTransformer;
    camelResponse?: AxiosTransformer;
    snakeParams?: AxiosInterceptor;
  };
};
export interface ApplyConverters {
  (axios: AxiosInstance, options?: ApplyCaseMiddlewareOptions): AxiosInstance;
}
