import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import applyCaseMiddleware from "../../src";

/* eslint-disable @typescript-eslint/camelcase */

const snakeData = {
  user_id: 1,
  something_object: {
    foo_bar_baz123: "fooBarBaz123",
    this_snake_should_be_preserved: "preserved",
    thisCamelShouldBePreserved: "preserved",
  },
  something_array: ["foo", { foo_bar_baz456: "fooBarBaz456" }],
  entries: {
    foo_bar_baz123: "fooBarBaz123",
  },
  append: {
    foo_bar_baz123: "fooBarBaz123",
  },
  constructor: {
    foo_bar_baz123: "fooBarBaz123",
  },
  prototype: {
    foo_bar_baz123: "fooBarBaz123",
  },
  empty: null,
};

const camelData = {
  userId: 1,
  somethingObject: {
    fooBarBaz123: "fooBarBaz123",
    this_snake_should_be_preserved: "preserved",
    thisCamelShouldBePreserved: "preserved",
  },
  somethingArray: ["foo", { fooBarBaz456: "fooBarBaz456" }],
  entries: {
    fooBarBaz123: "fooBarBaz123",
  },
  append: {
    fooBarBaz123: "fooBarBaz123",
  },
  constructor: {
    fooBarBaz123: "fooBarBaz123",
  },
  prototype: {
    fooBarBaz123: "fooBarBaz123",
  },
  empty: null,
};

const client = applyCaseMiddleware(
  axios.create({
    baseURL: "http://example.com",
  }),
  {
    preservedKeys: [
      "this_snake_should_be_preserved",
      "thisCamelShouldBePreserved",
      "THIS-HEADER-SHOULD-BE-PRESERVED",
    ],
  }
);
const mock = new MockAdapter(client);

test("it should be converted on success", (done) => {
  mock.onPost("/success").reply((config) => {
    expect(config.method).toBe("post");
    expect(config.headers["X-Requested-With"]).toBe("XMLHttpRequest");
    expect(config.headers.thisCamelShouldBePreserved).toBe("preserved");
    expect(config.params.user_id).toBe(1);
    expect(config.params.screen_name).toBe("yay");
    expect(config.params.thisCamelShouldBePreserved).toBe("preserved");
    expect(config.data).toBe(JSON.stringify(snakeData));
    return [
      200,
      snakeData,
      {
        "Content-Type": "application/json",
        "THIS-HEADER-SHOULD-BE-PRESERVED": "preserved",
      },
    ];
  });
  client
    .post("/success", camelData, {
      headers: {
        xRequestedWith: "XMLHttpRequest",
        thisCamelShouldBePreserved: "preserved",
      },
      params: {
        userId: 1,
        screenName: "yay",
        thisCamelShouldBePreserved: "preserved",
      },
    })
    .then((response) => {
      expect(JSON.stringify(response.data)).toBe(JSON.stringify(camelData));
      expect(response.headers.contentType).toBe("application/json");
      expect(response.headers["THIS-HEADER-SHOULD-BE-PRESERVED"]).toBe(
        "preserved"
      );
      done();
    })
    .catch((error) => {
      done(error);
    });
});

test("it should be converted on failure", (done) => {
  mock.onPost("/failure").reply((config) => {
    expect(config.method).toBe("post");
    expect(config.headers["X-Requested-With"]).toBe("XMLHttpRequest");
    expect(config.headers.thisCamelShouldBePreserved).toBe("preserved");
    expect(config.params.user_id).toBe(1);
    expect(config.params.screen_name).toBe("yay");
    expect(config.params.thisCamelShouldBePreserved).toBe("preserved");
    expect(config.data).toBe(JSON.stringify(snakeData));
    return [
      400,
      snakeData,
      {
        "Content-Type": "application/json",
        "THIS-HEADER-SHOULD-BE-PRESERVED": "preserved",
      },
    ];
  });
  client
    .post("/failure", camelData, {
      headers: {
        xRequestedWith: "XMLHttpRequest",
        thisCamelShouldBePreserved: "preserved",
      },
      params: {
        userId: 1,
        screenName: "yay",
        thisCamelShouldBePreserved: "preserved",
      },
    })
    .then(
      () => {
        done(new Error("Error has not been occurred."));
      },
      (error) => {
        expect(JSON.stringify(error.response.data)).toBe(
          JSON.stringify(camelData)
        );
        expect(error.response.headers.contentType).toBe("application/json");
        expect(error.response.headers["THIS-HEADER-SHOULD-BE-PRESERVED"]).toBe(
          "preserved"
        );
        done();
      }
    );
});
