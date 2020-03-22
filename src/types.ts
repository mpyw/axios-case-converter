import { Options as NoCaseOptions } from "camel-case";
import { AxiosRequestConfig, AxiosTransformer, AxiosInstance } from "axios";

// string transformers (change-case functions)
export interface Transformer {
  (input: string, options?: NoCaseOptions): string;
}

// objects which can be handled in object transformers
export interface TransformableObject {
  [key: string]: unknown;
}
export type Transformable = (unknown[] | object | FormData | URLSearchParams) &
  TransformableObject;

// object transformers and their factories
export type TransformOptions = {
  overwrite?: boolean;
  preservedKeys?: string[];
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

// converters for axios and their factories
export type ConverterOptions = Omit<TransformOptions, "overwrite">;
export interface AxiosInterceptor {
  (config: AxiosRequestConfig): AxiosRequestConfig;
}
export interface CreateAxiosInterceptor {
  (options?: ConverterOptions): AxiosInterceptor;
}
export interface CreateAxiosTransformer {
  (options?: ConverterOptions): AxiosTransformer;
}

// converter applier
export type ApplyConvertersOptions = {
  converters?: {
    snakeRequest?: AxiosTransformer;
    camelResponse?: AxiosTransformer;
    snakeParams?: AxiosInterceptor;
  };
  preservedKeys?: TransformOptions["preservedKeys"];
};
export interface ApplyConverters {
  (axios: AxiosInstance, options?: ApplyConvertersOptions): AxiosInstance;
}
