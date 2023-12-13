import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import postcss from 'rollup-plugin-postcss';

export default {
  input: 'src/index.jsx',
  output: {
    globals: {
      'react': 'React',
      'prop-types': 'PropTypes'
    },
    file: 'dist/bundle.js',
    format: 'umd',
    name: 'quite-simple-reactdatatable',
    sourcemap: true, // Ajout des source maps
  },
  external: [
    'react',
    'prop-types'
  ],
  plugins: [
    resolve(),
    commonjs(),
    babel({ babelHelpers: 'bundled', presets: ['@babel/preset-react'] }),
    postcss()
  ]
};
