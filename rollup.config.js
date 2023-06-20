import { terser } from 'rollup-plugin-terser'

export default {
  input: './wc-date-input.js',
  output: {
    file: 'dist/wc-date-input.min.js',
    format: 'iife',
    sourcemap: 'inline',
  },
  plugins: [
    terser()
  ],
}