import axios, { AxiosHeaders } from 'axios';

// Dirty hacks for https://github.com/mpyw/axios-case-converter/issues/47
export function newAxiosHeadersFrom(
  thing?: Record<string, string | string[] | number | boolean | null> | string
): AxiosHeaders {
  let ctor: ReturnType<typeof Object.getPrototypeOf>['constructor'];
  const client = axios.create();
  client
    .get('https://invalid', {
      transformRequest: [
        (_, h) => {
          ctor = Object.getPrototypeOf(h).constructor;
        },
      ],
    })
    .catch(() => undefined);
  return new ctor(thing) as AxiosHeaders;
}
