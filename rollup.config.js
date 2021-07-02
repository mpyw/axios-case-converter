import nodeResolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';

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
  },
  plugins: [
    nodeResolve({
      extensions: ['.ts'],
    }),
    babel({
      include: ['src/**/*'],
      exclude: 'node_modules/**',
      extensions: ['.ts'],
    }),
    isProd && terser(),
  ],
};

export default config;
