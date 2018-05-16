import test from 'tape'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import applyConverters from '../src'

const data = {
  user_id: 1,
  something_object: {
    foo_bar_baz123: 'fooBarBaz123',
  },
  something_array: [
    'foo',
    { foo_bar_baz456: 'fooBarBaz456' },
  ],
  entries: {
    foo_bar_baz123: 'fooBarBaz123',
  },
  empty: null,
}

const client = applyConverters(axios.create({
  baseURL: 'http://example.com',
}))
const mock = new MockAdapter(client)

test('it should be converted on success', assert => {
  mock.onPost('/success').reply(config => {
    assert.equal(config.method, 'post')
    assert.equal(config.headers['X-Requested-With'], 'XMLHttpRequest')
    assert.equal(config.params.user_id, 1)
    assert.equal(config.params.screen_name, 'yay')
    assert.equal(config.data, JSON.stringify(data))
    return [200, data, {'Content-Type': 'application/json'}]
  })
  client.post(
    '/success',
    {
      userId: 1,
      somethingObject: {
        fooBarBaz123: 'fooBarBaz123',
      },
      somethingArray: [
        'foo',
        { fooBarBaz456: 'fooBarBaz456' },
      ],
      entries: {
        fooBarBaz123: 'fooBarBaz123',
      },
      empty: null,
    },
    {
      headers: {
        xRequestedWith: 'XMLHttpRequest',
      },
      params: {
        userId: 1,
        screenName: 'yay',
      },
    }
  ).then(response => {
    assert.deepEqual(response.data, {
      userId: 1,
      somethingObject: {
        fooBarBaz123: 'fooBarBaz123',
      },
      somethingArray: [
        'foo',
        { fooBarBaz456: 'fooBarBaz456' },
      ],
      entries: {
        fooBarBaz123: 'fooBarBaz123',
      },
      empty: null,
    })
    assert.equal(response.headers.contentType, 'application/json')
    assert.end()
  })
})

test('it should be converted on failure', assert => {
  mock.onPost('/failure').reply(config => {
    assert.equal(config.method, 'post')
    assert.equal(config.headers['X-Requested-With'], 'XMLHttpRequest')
    assert.equal(config.params.user_id, 1)
    assert.equal(config.params.screen_name, 'yay')
    assert.equal(config.data, JSON.stringify(data))
    return [400, data, {'Content-Type': 'application/json'}]
  })
  client.post(
    '/failure',
    {
      userId: 1,
      somethingObject: {
        fooBarBaz123: 'fooBarBaz123',
      },
      somethingArray: [
        'foo',
        { fooBarBaz456: 'fooBarBaz456' },
      ],
      entries: {
        fooBarBaz123: 'fooBarBaz123',
      },
      empty: null,
    },
    {
      headers: {
        xRequestedWith: 'XMLHttpRequest',
      },
      params: {
        userId: 1,
        screenName: 'yay',
      },
    }
  ).catch(error => {
    assert.deepEqual(error.response.data, {
      userId: 1,
      somethingObject: {
        fooBarBaz123: 'fooBarBaz123',
      },
      somethingArray: [
        'foo',
        { fooBarBaz456: 'fooBarBaz456' },
      ],
      entries: {
        fooBarBaz123: 'fooBarBaz123',
      },
      empty: null,
    })
    assert.equal(error.response.headers.contentType, 'application/json')
    assert.end()
  })
})
