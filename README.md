# axios-case-converter

[![npm version](https://badge.fury.io/js/axios-case-converter.svg)](https://badge.fury.io/js/axios-case-converter)
[![Build Status](https://travis-ci.org/mpyw/axios-case-converter.svg?branch=master)](https://travis-ci.org/mpyw/axios-case-converter)

Axios transformer/interceptor that converts *snake_case/camelCase*

- Converts outgoing `data` `params` object keys into *snake_case*
- Converts incoming `data` object keys into *camelCase*
- Converts outgoing `headers` object keys into *Header-Case*
- Converts incoming `headers` object keys into *camelCase*

## Usage

You can fully use *camelCase*.

```js
import applyConverters from 'axios-case-converter'
import axios from 'axios'

(async () => {

  const client = applyConverters(axios.create())
  const { data } = await client.post('https://example.com/api/endpoint',
    {
      targetId: 1,
    },
    {
      params: { userId: 1 },
      headers: { userAgent: 'Mozilla' },
    }
  )

  console.log(data.actionResult.users[0].screenName)

})()
```

## Attention

If you use `FormData` on **Internet Explorer** or **Safari**, you need polyfill of `FormData.prototype.entries()`.

- [jimmywarting/FormData: HTML5 `FormData` polyfill for Browsers.](https://github.com/jimmywarting/FormData)
