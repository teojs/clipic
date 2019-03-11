import babel from 'rollup-plugin-babel'
import { uglify } from 'rollup-plugin-uglify'
import typescript from 'rollup-plugin-typescript'
export default [
  {
    input: './src/main.ts',
    output: {
      file: './dist/clipic.js',
      format: 'umd',
      name: 'Clipic'
    },
    plugins: [
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
    plugins: [,
      typescript(),
      babel({
        exclude: 'node_modules/**'
      }),
      uglify()
    ]
  }
]
