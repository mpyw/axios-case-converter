import { Options as NoCaseOptions } from "camel-case";
import { AxiosInstance, AxiosRequestConfig, AxiosTransformer } from "axios";

/** string transformers (change-case functions) */
export interface CaseFunction {
  (input: string, options?: NoCaseOptions): string;
}
export type CaseFunctions = {
  snake?: CaseFunction;
  camel?: CaseFunction;
  header?: CaseFunction;
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
export interface TransformUsingCallback {
  (
    data: unknown,
    fn: CaseFunction,
    options?: ObjectTransformerOptions | boolean
  ): unknown;
}
export interface Transform {
  (
    data: Parameters<TransformUsingCallback>[0],
    options?: Parameters<TransformUsingCallback>[2]
  ): unknown;
}
export interface CreateTransform {
  (fn: CaseFunction): Transform;
}
export interface CreateTransformOf {
  (type: keyof CaseFunctions, options?: CaseFunctions): Transform;
}
export interface CreateTransforms {
  (options?: CaseFunctions): Record<keyof CaseFunctions, Transform>;
}

/** converters for axios and their factories */
export type ConverterOptions = Omit<ObjectTransformerOptions, "overwrite"> & {
  caseFunctions?: CaseFunctions;
  ignoreHeaders?: boolean;
};
export interface AxiosInterceptor {
  (config: AxiosRequestConfig): AxiosRequestConfig;
}
export interface CreateAxiosInterceptor {
  (options?: ConverterOptions): AxiosInterceptor;
}
export interface CreateAxiosTransformer {
  (options?: ConverterOptions): AxiosTransformer;
}

/** converter applier */
export type ApplyConvertersOptions = ConverterOptions & {
  converters?: {
    snakeRequest?: AxiosTransformer;
    camelResponse?: AxiosTransformer;
    snakeParams?: AxiosInterceptor;
  };
};
export interface ApplyConverters {
  (axios: AxiosInstance, options?: ApplyConvertersOptions): AxiosInstance;
}
