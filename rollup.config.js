var nodeResolve = require('rollup-plugin-node-resolve')
var babel = require('rollup-plugin-babel')
var replace = require('rollup-plugin-replace')
var commonjs = require('rollup-plugin-commonjs')

module.exports = {
  external: [
    'react'
  ],
  globals: {
    react: 'React'
  },
  // Set library in release script
  // moduleName: 'Recompose',
  format: 'umd',
  plugins: [
    nodeResolve({
      jsnext: true
    }),
    babel({
      exclude: 'node_modules/**',
      babelrc: false,
      plugins: [
        "babel-plugin-transform-function-bind",
        "babel-plugin-transform-class-constructor-call",
        ["babel-plugin-transform-class-properties", { "loose": true }],
        "babel-plugin-transform-export-extensions",
        "babel-plugin-syntax-trailing-function-commas",
        "babel-plugin-transform-object-rest-spread",
        "babel-plugin-transform-async-to-generator",

        "babel-plugin-transform-react-jsx",
        "babel-plugin-syntax-jsx",
        "babel-plugin-transform-react-display-name",

        ["babel-plugin-transform-es2015-template-literals", { "loose": true }],
        "babel-plugin-transform-es2015-literals",
        "babel-plugin-transform-es2015-function-name",
        "babel-plugin-transform-es2015-arrow-functions",
        "babel-plugin-transform-es2015-block-scoped-functions",
        ["babel-plugin-transform-es2015-classes", { "loose": true }],
        "babel-plugin-transform-es2015-shorthand-properties",
        ["babel-plugin-transform-es2015-computed-properties", { "loose": true }],
        ["babel-plugin-transform-es2015-spread", { "loose": true }],
        "babel-plugin-transform-es2015-parameters",
        ["babel-plugin-transform-es2015-destructuring", { "loose": true }],
        "babel-plugin-transform-es2015-block-scoping",
        "babel-plugin-transform-regenerator",
        'babel-plugin-external-helpers'
      ]
    }),
    commonjs(),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ]
}
