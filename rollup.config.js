import path from 'path'
import typescript from 'typescript'
import clearPlugin from 'rollup-plugin-clear'
import jsonPlugin from 'rollup-plugin-json'
import typescriptPlugin from 'rollup-plugin-typescript2'
import resolvePlugin from 'rollup-plugin-node-resolve'
import commonjsPlugin from 'rollup-plugin-commonjs'
import sourceMapsPlugin from 'rollup-plugin-sourcemaps'
import { terser as terserPlugin } from 'rollup-plugin-terser'

import pkg from './package.json'

const isProd = process.env.BUILD === 'production'
const distFolders = Array.from(new Set([
  path.dirname(pkg.main),
  path.dirname(pkg.module)
]))

export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
      exports: 'named'
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true,
      exports: 'named'
    },
  ],
  external: [
    ...Object.keys(pkg.peerDependencies || {})
  ],
  plugins: [
    clearPlugin({
      targets: distFolders
    }),
    jsonPlugin(),
    resolvePlugin({
      browser: true
    }),
    commonjsPlugin({
      rollupCommonJSResolveHack: true
    }),
    typescriptPlugin({
      typescript,
      tsconfigOverride: !isProd
        ? {
          compilerOptions: {
            noUnusedLocals: false,
            noUnusedParameters: false,
          }
        }
        : undefined
    }),
    sourceMapsPlugin(),
    isProd && terserPlugin(),
  ].filter(Boolean),
}
