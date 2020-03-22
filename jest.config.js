module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  rootDir: ".",
  roots: ["<rootDir>/src/", "<rootDir>/test/"],
  testMatch: ["<rootDir>/test/**/*.ts"],
  collectCoverageFrom: ["<rootDir>/src/**/*.ts"],
  globals: {
    "ts-jest": {
      babelConfig: {
        plugins: ["@babel/plugin-proposal-optional-chaining"],
      },
    },
  },
};
