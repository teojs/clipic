import babel from 'rollup-plugin-babel'
import { uglify } from 'rollup-plugin-uglify'
export default {
  input: './src/main.js',
  output: {
    file: './dist/breathe.js',
    format: 'umd',
    name: 'Breathe'
  },
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    uglify()
  ]
}
