import {
  createObjectTransformer,
  createObjectTransformerOf,
  createObjectTransformers,
} from "../../src/transformers";
import { noCase } from "no-case";
import { snakeCase } from "snake-case";
import { camelCase } from "camel-case";

beforeEach(() => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  global.Blob = require("blob-polyfill").Blob;
  require("url-search-params-polyfill");
  require("formdata-polyfill");
});

afterEach(() => {
  /* eslint-disable @typescript-eslint/ban-ts-ignore */
  // @ts-ignore
  delete global.Blob;
  // @ts-ignore
  delete global.FormData;
  // @ts-ignore
  delete global.URLSearchParams;
  /* eslint-enable @typescript-eslint/ban-ts-ignore */
  jest.resetModules();
});

test("it should recreate URLSearchParams", () => {
  const before = new URLSearchParams([
    ["keyOne", "valueOne"],
    ["keyOne", "valueOne"],
    ["keyTwo", "valueTwo"],
    ["arrayList[arrayKey]", "arrayItem"],
    ["arrayList[arrayKey]", "arrayItem"],
  ]);

  const after = createObjectTransformer(noCase)(before);

  expect(after).toBeInstanceOf(URLSearchParams);
  expect(String(before)).toBe(
    "keyOne=valueOne&keyOne=valueOne&keyTwo=valueTwo&arrayList%5BarrayKey%5D=arrayItem&arrayList%5BarrayKey%5D=arrayItem"
  );
  expect(String(after)).toBe(
    "key+one=valueOne&key+one=valueOne&key+two=valueTwo&array+list%5Barray+key%5D=arrayItem&array+list%5Barray+key%5D=arrayItem"
  );
});

test("it should overwrite URLSearchParams", () => {
  const before = new URLSearchParams([
    ["keyOne", "valueOne"],
    ["keyOne", "valueOne"],
    ["keyTwo", "valueTwo"],
    ["arrayList[arrayKey]", "arrayItem"],
    ["arrayList[arrayKey]", "arrayItem"],
  ]);

  const after = createObjectTransformer(noCase)(before, { overwrite: true });

  expect(after).toBeInstanceOf(URLSearchParams);
  expect(String(before)).toBe(
    "key+one=valueOne&key+one=valueOne&key+two=valueTwo&array+list%5Barray+key%5D=arrayItem&array+list%5Barray+key%5D=arrayItem"
  );
  expect(String(after)).toBe(
    "key+one=valueOne&key+one=valueOne&key+two=valueTwo&array+list%5Barray+key%5D=arrayItem&array+list%5Barray+key%5D=arrayItem"
  );
});

test("it should recreate FormData", () => {
  const before = new FormData();
  before.append("keyOne", "valueOne");
  before.append("keyOne", "valueOne");
  before.append("keyTwo", "valueTwo");
  before.append("arrayList[arrayKey]", "arrayItem");
  before.append("arrayList[arrayKey]", "arrayItem");

  const after = createObjectTransformer(noCase)(before);

  expect(after).toBeInstanceOf(FormData);
  expect(JSON.stringify([...before.entries()])).toBe(
    '[["keyOne","valueOne"],["keyOne","valueOne"],["keyTwo","valueTwo"],["arrayList[arrayKey]","arrayItem"],["arrayList[arrayKey]","arrayItem"]]'
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expect(JSON.stringify([...((after as any) as FormData).entries()])).toBe(
    '[["key one","valueOne"],["key one","valueOne"],["key two","valueTwo"],["array list[array key]","arrayItem"],["array list[array key]","arrayItem"]]'
  );
});

test("it should overwrite FormData", () => {
  const before = new FormData();
  before.append("keyOne", "valueOne");
  before.append("keyOne", "valueOne");
  before.append("keyTwo", "valueTwo");
  before.append("arrayList[arrayKey]", "arrayItem");
  before.append("arrayList[arrayKey]", "arrayItem");

  const after = createObjectTransformer(noCase)(before, { overwrite: true });

  expect(after).toBeInstanceOf(FormData);
  expect(JSON.stringify([...before.entries()])).toBe(
    '[["key one","valueOne"],["key one","valueOne"],["key two","valueTwo"],["array list[array key]","arrayItem"],["array list[array key]","arrayItem"]]'
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expect(JSON.stringify([...((after as any) as FormData).entries()])).toBe(
    '[["key one","valueOne"],["key one","valueOne"],["key two","valueTwo"],["array list[array key]","arrayItem"],["array list[array key]","arrayItem"]]'
  );
});

test("it should recursively recreate objects", () => {
  const before = {
    simpleKey: "valueOne",
    arrayKey: [
      "arrayValue",
      "arrayValue",
      { arrayItemKey: "arrayNestedValue" },
    ],
    nestedKey: {
      nestedItemKey: "nestedItemKey",
    },
  };

  const after = createObjectTransformer(noCase)(before);

  expect(after).toBeInstanceOf(Object);
  expect(JSON.stringify(before)).toBe(
    '{"simpleKey":"valueOne","arrayKey":["arrayValue","arrayValue",{"arrayItemKey":"arrayNestedValue"}],"nestedKey":{"nestedItemKey":"nestedItemKey"}}'
  );
  expect(JSON.stringify(after)).toBe(
    '{"simple key":"valueOne","array key":["arrayValue","arrayValue",{"array item key":"arrayNestedValue"}],"nested key":{"nested item key":"nestedItemKey"}}'
  );
});

test("it should recursively overwrite objects", () => {
  const before = {
    simpleKey: "valueOne",
    arrayKey: [
      "arrayValue",
      "arrayValue",
      { arrayItemKey: "arrayNestedValue" },
    ],
    nestedKey: {
      nestedItemKey: "nestedItemKey",
    },
  };

  const after = createObjectTransformer(noCase)(before, { overwrite: true });

  expect(after).toBeInstanceOf(Object);
  expect(JSON.stringify(before)).toBe(
    '{"simple key":"valueOne","array key":["arrayValue","arrayValue",{"array item key":"arrayNestedValue"}],"nested key":{"nested item key":"nestedItemKey"}}'
  );
  expect(JSON.stringify(after)).toBe(
    '{"simple key":"valueOne","array key":["arrayValue","arrayValue",{"array item key":"arrayNestedValue"}],"nested key":{"nested item key":"nestedItemKey"}}'
  );
});

test("it should recreate null-prototyped objects", () => {
  const before = Object.create(null);
  before.simpleKey = "valueOne";

  const after = createObjectTransformer(noCase)(before);

  expect(after).not.toBeInstanceOf(Object);
  expect(Object.getPrototypeOf(after)).toBeNull();
  expect(JSON.stringify(before)).toBe('{"simpleKey":"valueOne"}');
  expect(JSON.stringify(after)).toBe('{"simple key":"valueOne"}');
});

test("it should overwrite null-prototyped objects", () => {
  const before = Object.create(null);
  before.simpleKey = "valueOne";

  const after = createObjectTransformer(noCase)(before, { overwrite: true });

  expect(after).not.toBeInstanceOf(Object);
  expect(Object.getPrototypeOf(after)).toBeNull();
  expect(JSON.stringify(before)).toBe('{"simple key":"valueOne"}');
  expect(JSON.stringify(after)).toBe('{"simple key":"valueOne"}');
});

test("it should prevent prototype pollution attack", () => {
  const before = JSON.parse(
    '{"simpleKey":"valueOne","__proto__":{"attacked":true}}'
  );

  const after = createObjectTransformer(noCase)(before);

  expect(after).toBeInstanceOf(Object);
  expect(Object.getPrototypeOf(after).attacked).toBeUndefined();
  expect(JSON.stringify(before)).toBe(
    '{"simpleKey":"valueOne","__proto__":{"attacked":true}}'
  );
  expect(JSON.stringify(after)).toBe('{"simple key":"valueOne"}');
});

test("it should replace built-in change-case functions", () => {
  const { snake: fakeSnake, camel: fakeCamel } = createObjectTransformers({
    snake: camelCase,
    camel: snakeCase,
  });

  // eslint-disable-next-line @typescript-eslint/camelcase
  expect(fakeSnake({ user_profile: true })).toEqual({ userProfile: true });
  // eslint-disable-next-line @typescript-eslint/camelcase
  expect(fakeCamel({ userProfile: true })).toEqual({ user_profile: true });
});

test("it should override change-case function options", () => {
  const camel = createObjectTransformerOf("camel");
  expect(camel({ "user_profile[screen_name]": true })).toEqual({
    "userProfile[screenName]": true,
  });
  expect(
    camel(
      { "user_profile[screen_name]": true },
      {
        caseOptions: { stripRegexp: /[^A-Z0-9]+/gi },
      }
    )
  ).toEqual({ userProfileScreenName: true });
});

test("it should override preserve specific keys", () => {
  const camel = createObjectTransformerOf("camel");
  // eslint-disable-next-line @typescript-eslint/camelcase
  expect(camel({ user_profile: true, other_profile: true })).toEqual({
    userProfile: true,
    otherProfile: true,
  });
  expect(
    camel(
      // eslint-disable-next-line @typescript-eslint/camelcase
      { user_profile: true, other_profile: true },
      {
        preservedKeys: ["user_profile"],
      }
    )
    // eslint-disable-next-line @typescript-eslint/camelcase
  ).toEqual({ user_profile: true, otherProfile: true });
  expect(
    camel(
      // eslint-disable-next-line @typescript-eslint/camelcase
      { user_profile: true, other_profile: true },
      {
        preservedKeys: (key) => key === "user_profile",
      }
    )
    // eslint-disable-next-line @typescript-eslint/camelcase
  ).toEqual({ user_profile: true, otherProfile: true });
});
