import nodeResolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import typescript from '@rollup/plugin-typescript';

const isProd = process.env.NODE_ENV === 'production';

const config = {
  input: 'src/index.ts',
  output: {
    format: 'umd',
    name: 'AxiosCaseConverter',
    sourcemap: true,
    compact: isProd,
    indent: !isProd,
    exports: 'named',
    file: `dist/axios-case-converter.${isProd ? 'min.js' : 'js'}`,
    globals: {
      axios: 'axios',
    },
  },
  plugins: [
    nodeResolve({
      extensions: ['.ts'],
    }),
    typescript({
      tsconfig: 'tsconfig.umd.json',
    }),
    isProd && terser(),
  ],
  external: ['axios'],
};

export default config;
