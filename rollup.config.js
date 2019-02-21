import babel from 'rollup-plugin-babel'
import { uglify } from 'rollup-plugin-uglify'
export default {
  input: './src/main.js',
  output: {
    file: 'clipic.js',
    format: 'umd',
    name: 'Clipic'
  },
  plugins: [
    babel({
      exclude: 'node_modules/**'
    })/* ,
    uglify() */
  ]
}
