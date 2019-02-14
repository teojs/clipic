import babel from 'rollup-plugin-babel'
import { uglify } from 'rollup-plugin-uglify'
export default {
  input: './src/main.js',
  output: {
    file: './dist/breath.min.js',
    format: 'umd',
    name: 'Breath'
  },
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    uglify()
  ]
}
