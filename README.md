# axios-case-converter

[![npm version](https://badge.fury.io/js/axios-case-converter.svg)](https://badge.fury.io/js/axios-case-converter)
[![Build Status](https://travis-ci.org/mpyw/axios-case-converter.svg?branch=master)](https://travis-ci.org/mpyw/axios-case-converter)

Axios transformer/interceptor that converts _snake_case/camelCase_

- Converts outgoing `data` `params` object keys into _snake_case_
- Converts incoming `data` object keys into _camelCase_
- Converts outgoing `headers` object keys into _Header-Case_
- Converts incoming `headers` object keys into _camelCase_

## Usage

You can fully use _camelCase_.

```js
import applyConverters from 'axios-case-converter';
import axios from 'axios';

(async () => {
  const client = applyConverters(axios.create());
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

## Attention

### `FormData` compatibility

If you use `FormData` on **Internet Explorer** or **Safari**, you need polyfill of `FormData.prototype.entries()`.

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
