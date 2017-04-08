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
  external: [
    'react'
  ],
  globals: {
    react: 'React'
  },
  moduleName: libraryName,
  format: 'umd',
  plugins: [
    nodeResolve({
      jsnext: true
    }),
    babel({
      exclude: 'node_modules/**',
      babelrc: false,
      plugins: [
        'babel-plugin-transform-function-bind',
        'babel-plugin-transform-class-constructor-call',
        ['babel-plugin-transform-class-properties', { loose: true }],
        'babel-plugin-transform-export-extensions',
        'babel-plugin-syntax-trailing-function-commas',
        'babel-plugin-transform-object-rest-spread',
        'babel-plugin-transform-async-to-generator',

        'babel-plugin-transform-react-jsx',
        'babel-plugin-syntax-jsx',
        'babel-plugin-transform-react-display-name',

        ['babel-plugin-transform-es2015-template-literals', { loose: true }],
        'babel-plugin-transform-es2015-literals',
        'babel-plugin-transform-es2015-function-name',
        'babel-plugin-transform-es2015-arrow-functions',
        'babel-plugin-transform-es2015-block-scoped-functions',
        ['babel-plugin-transform-es2015-classes', { loose: true }],
        'babel-plugin-transform-es2015-shorthand-properties',
        ['babel-plugin-transform-es2015-computed-properties', { loose: true }],
        ['babel-plugin-transform-es2015-spread', { loose: true }],
        'babel-plugin-transform-es2015-parameters',
        ['babel-plugin-transform-es2015-destructuring', { loose: true }],
        'babel-plugin-transform-es2015-block-scoping',
        'babel-plugin-transform-regenerator',
        'babel-plugin-external-helpers'
      ]
    }),
    commonjs(),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ]
}

if (build === 'umd') {
  config.dest = `${outDir}/build/${libraryName}.js`
}

if (build === 'min') {
  config.dest = `${outDir}/build/${libraryName}.min.js`
  config.plugins.push(
    uglify({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        screw_ie8: true,
        warnings: false
      }
    })
  )
}

export default config
