const path = require('path')
const nodeResolve = require('rollup-plugin-node-resolve')
const babel = require('rollup-plugin-babel')
const replace = require('rollup-plugin-replace')
const commonjs = require('rollup-plugin-commonjs')
const uglify = require('rollup-plugin-uglify')
const { pascalCase } = require('change-case')
const { PACKAGES_SRC_DIR, PACKAGES_OUT_DIR } = require('./getPackageNames')

const build = process.env.BUILD
const packageName = process.env.PACKAGE_NAME
const libraryName = pascalCase(packageName)
const sourceDir = path.resolve(PACKAGES_SRC_DIR, packageName)
const outDir = path.resolve(PACKAGES_OUT_DIR, packageName)

const config = {
  entry: `${sourceDir}/index.js`,
  external: ['react'],
  globals: {
    react: 'React',
  },
  moduleName: libraryName,
  plugins: [
    babel({
      exclude: '**/node_modules/**',
    }),
  ],
}

if (build === 'es' || build === 'cjs') {
  config.external.push(
    'fbjs/lib/shallowEqual',
    'hoist-non-react-statics',
    'change-emitter',
    'symbol-observable',
    'react-relay',
    'recompose'
  )
  config.dest = `${outDir}/${build}/${libraryName}.js`
  config.format = build
}

if (build === 'umd') {
  config.dest = `${outDir}/build/${libraryName}.js`
  config.format = 'umd'
  config.plugins.push(
    nodeResolve({
      jsnext: true,
    }),
    commonjs(),
    replace({
      'process.env.NODE_ENV': JSON.stringify('development'),
    })
  )
}

if (build === 'min') {
  config.dest = `${outDir}/build/${libraryName}.min.js`
  config.format = 'umd'
  config.plugins.push(
    nodeResolve({
      jsnext: true,
    }),
    commonjs(),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    uglify({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        screw_ie8: true,
        warnings: false,
      },
    })
  )
}

export default config
