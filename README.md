# axios-case-converter

[![npm version](https://badge.fury.io/js/axios-case-converter.svg)](https://badge.fury.io/js/axios-case-converter)
[![Build Status](https://github.com/mpyw/axios-case-converter/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/mpyw/axios-case-converter/actions)
[![Coverage Status](https://coveralls.io/repos/github/mpyw/axios-case-converter/badge.svg?branch=master)](https://coveralls.io/github/mpyw/axios-case-converter?branch=master)

Axios transformer/interceptor that converts _snake_case/camelCase_

- Converts outgoing `data` `params` object keys into _snake_case_
- Converts incoming `data` object keys into _camelCase_
- Converts outgoing `headers` object keys into _Header-Case_
- Converts incoming `headers` object keys into _camelCase_

## Installing

### NPM

```
npm install axios-case-converter
```

### CDN

```html
<script src="https://unpkg.com/axios-case-converter@latest/dist/axios-case-converter.min.js"></script>
```

It is strongly recommended that you replace `latest` with a fixed version.

## Usage

You can fully use _camelCase_ in your JavaScript codes.

```js
import applyCaseMiddleware from 'axios-case-converter';
import axios from 'axios';

(async () => {
  const client = applyCaseMiddleware(axios.create());
  const { data } = await client.post(
    'https://example.com/api/endpoint',
    {
      targetId: 1
    },
    {
      params: { userId: 1 },
      headers: { userAgent: 'Mozilla' }
    }
  );

  console.log(data.actionResult.users[0].screenName);
})();
```

## Options

```js
const client = applyCaseMiddleware(axios.create(), options);
```

### `preservedKeys`: `string[] | Function`

Disable transformation when the string matched or satisfied the condition.

```js
const options = {
  preservedKeys: ['preserve_this_key_1', 'preserve_this_key_2']
};
```

```js
const options = {
  preservedKeys: (input) => {
    return ['preserve_this_key_1', 'preserve_this_key_2'].includes(input);
  }
};
```

### `ignoreHeaders`: `boolean`

Disable HTTP headers transformation.

```js
const options = {
  ignoreHeaders: true
};
```

### `caseFunctions`: `{ snake?: Function, camel?: Function, header?: Function }`

Override built-in `change-case` functions.

```js
const options = {
  caseFunctions: {
    camel: (input, options) => {
      return (input.charAt(0).toLowerCase() + input.slice(1)).replace(/[-_](.)/g, (match, group1) => group1.toUpperCase());
    }
  }
};
```


### `caseOptions`: `{ stripRegexp?: RegExp }`

By default, **`{ stripRegexp: /[^A-Z0-9[\]]+/gi }`** is used as default `change-case` function options.
This preserves `[]` chars in object keys.
If you wish keeping original `change-case` behavior, override the options.

```js
const options = {
  caseOptions: {
    stripRegexp: /[^A-Z0-9]+/gi
  }
};
```

### `caseMiddleware`: `{ requestTransformer?: Function, responseTransformer?: Function, requestInterceptor?: Function }`

Totally override `axios-case-converter` behaviors.

```js
const options = {
  caseMiddleware: {
    requestInterceptor: (config) => {
      // Disable query string transformation
      return config;
    }
  }
};
```

###### [Check the tests for more info](test)

## Attention

### `Object` compatibility

If you run on **Internet Explorer**, you need polyfill for `Object.prorotypte.entries()`.

- [zloirock/core-js: Standard Library](https://github.com/zloirock/core-js)

### `FormData` compatibility

If you use `FormData` on **Internet Explorer**, you need polyfill of `FormData.prototype.entries()`.

- [jimmywarting/FormData: HTML5 `FormData` polyfill for Browsers.](https://github.com/jimmywarting/FormData)

If you use `FormData` on **React Native**, please ignore the following warnings after confirming that polyfill is **impossible**.

```js
// RN >= 0.52
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings([
  'Be careful that FormData cannot be transformed on React Native.'
]);

// RN < 0.52
console.ignoredYellowBox = [
  'Be careful that FormData cannot be transformed on React Native.'
];
```

### `Symbol` compatibility

If you use **React Native** for **Android** development, you should use **Symbol** polyfill from `core-js` to avoid bugs with iterators:

1. Create `polyfill.js` in root directory with code:

```js
global.Symbol = require('core-js/es6/symbol');
require('core-js/fn/symbol/iterator');
```

2. Include `polyfill.js` in entry point of your app (e.g. `app.js`):

```js
import { Platform } from 'react-native';

// ...

if (Platform.OS === 'android') {
  require('./polyfill.js');
}
```

cf. [undefined is not a function(evaluating '_iterator\[typeof Symbol === "function"?Symbol.iterator:"@@iterator"\]()') · Issue #15902 · facebook/react-native](https://github.com/facebook/react-native/issues/15902)
