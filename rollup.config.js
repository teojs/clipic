import babel from 'rollup-plugin-babel'
import { uglify } from 'rollup-plugin-uglify'
import typescript from 'rollup-plugin-typescript'
import postcss from 'rollup-plugin-postcss'
export default [
  {
    input: './src/main.ts',
    output: {
      file: './dist/clipic.js',
      format: 'umd',
      name: 'Clipic'
    },
    plugins: [
      postcss({
        minimize: true
      }),
      typescript(),
      babel({
        exclude: 'node_modules/**'
      })
    ]
  },
  {
    input: './src/main.ts',
    output: {
      file: './dist/clipic.min.js',
      format: 'umd',
      name: 'Clipic'
    },
    plugins: [
      postcss({
        minimize: true
      }),
      typescript(),
      babel({
        exclude: 'node_modules/**'
      }),
      uglify()
    ]
  }
]
