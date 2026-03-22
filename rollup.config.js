import { terser } from 'rollup-plugin-terser'

function minifyTemplateLiterals() {
  return {
    name: 'minify-template-literals',
    transform(code) {
      const result = code.replace(/`([\s\S]*?)`/g, (match, content) => {
        // Split on ${...} so only string parts are minified, not expressions.
        // [^}]* is safe here because none of the expressions contain nested {}.
        const parts = content.split(/(\$\{[^}]*\})/)
        const minified = parts
          .map((part, i) => {
            if (i % 2 !== 0) return part // ${...} expression — leave untouched
            return part
              .replace(/\n[ \t]*/g, '') // remove newlines and their indentation
              .replace(/[ ]{2,}/g, ' ') // collapse runs of spaces to one
              .replace(/>[ ]+</g, '><') // remove spaces between tags
          })
          .join('')
        return '`' + minified + '`'
      })
      return { code: result, map: null }
    },
  }
}

export default {
  input: './wc-date-input.js',
  output: {
    file: 'dist/wc-date-input.min.js',
    format: 'iife',
    sourcemap: 'inline',
  },
  plugins: [
    minifyTemplateLiterals(),
    terser()
  ],
}