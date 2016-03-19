require('babel-core/register')
var path = require('path')
var webpack = require('webpack')
var getPackageNames = require('./scripts/getPackageNames').getPackageNames
var PACKAGES_SRC_DIR = require('./scripts/getPackageNames').PACKAGES_SRC_DIR

var packageAliases = getPackageNames().reduce(function(result, packageName) {
  result[packageName] = path.resolve(PACKAGES_SRC_DIR, packageName)
  return result
}, {})

module.exports = function(config) {
  if (process.env.TRAVIS) {
    config.set({
      browsers: ['PhantomJS'],
      frameworks: ['phantomjs-shim', 'mocha', 'sinon'],
      singleRun: true
    })
  } else {
    config.set({
      browsers: ['Chrome'],
      frameworks: ['mocha', 'sinon']
    })
  }

  config.set({
    reporters: ['mocha', 'coverage'],

    files: [
      'tests.webpack.js'
    ],

    preprocessors: {
      'tests.webpack.js': ['webpack', 'sourcemap'],
    },

    coverageReporter: {
      dir: 'coverage',
      reporters: [
        { type: 'lcov', subdir: '.' },
        { type: 'html', subdir: '.' }
      ]
    },

    webpack: {
      devtool: 'inline-source-map',
      module: {
        preLoaders: [{
          test: /\.js$/,
          exclude: [
            /__tests__/,
            /node_modules/,
            path.resolve(__dirname, './src/packages/recompose-relay/data'),
            path.resolve(__dirname, './src/karma.conf.js')
          ],
          loader: 'isparta'
        }, {
          test: /\.js$/,
          include: [
            /__tests__/,
            path.resolve(__dirname, './src/packages/recompose-relay/data')
          ],
          loader: 'babel',
          query: {
            plugins: [path.resolve(__dirname, './src/packages/recompose-relay/babelRelayPlugin')]
          }
        }]
      },
      resolve: {
        alias: packageAliases
      },
      plugins: [
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify('test')
        })
      ]
    },

    webpackMiddleware: {
      noInfo: true
    }
  })
}
