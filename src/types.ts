import { Options as NoCaseOptions } from "camel-case";
import { AxiosInstance, AxiosRequestConfig, AxiosTransformer } from "axios";

/** string transformers (change-case functions) */
export interface Transformer {
  (input: string, options?: NoCaseOptions): string;
}
export type Transformers = {
  snake?: Transformer;
  camel?: Transformer;
  header?: Transformer;
};

/** decorators for string transformers */
export interface PreserveArrayBrackets {
  (fn: Transformer): Transformer;
}
export interface PreserveSpecificKeys {
  (fn: Transformer, keys: string[] | PreservedKeysCondition): Transformer;
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
export type TransformOptions = {
  overwrite?: boolean;
  preservedKeys?: string[] | PreservedKeysCondition;
};
export interface TransformUsingCallback {
  (
    data: unknown,
    fn: Transformer,
    options?: TransformOptions | boolean
  ): unknown;
}
export interface Transform {
  (
    data: Parameters<TransformUsingCallback>[0],
    options?: Parameters<TransformUsingCallback>[2]
  ): unknown;
}
export interface CreateTransform {
  (fn: Transformer): Transform;
}
export interface CreateTransformOf {
  (type: keyof Transformers, options?: Transformers): Transform;
}
export interface CreateTransforms {
  (options?: Transformers): Record<keyof Transformers, Transform>;
}

/** converters for axios and their factories */
export type ConverterOptions = Omit<TransformOptions, "overwrite"> & {
  caseFunctions?: Transformers;
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
