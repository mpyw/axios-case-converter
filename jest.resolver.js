module.exports = (path, options) => options.defaultResolver(path, {
  ...options,
  packageFilter: pkg =>
    // HACK: Axios exports their module in both CommonJS style and ESM style.
    //       However, jest does prefer the ESM one that occurs a runtime error.
    //       So in this resolver the main module of axios package is replaced to CommonJS one.
    //       This only applies to tests.
    pkg.name === 'axios'
      ? { ...pkg, main: pkg.exports['.'].default.require }
      : pkg,
});
