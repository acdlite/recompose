'use strict'

var webpack = require('webpack')
var LodashModuleReplacementPlugin = require('lodash-webpack-plugin')

var reactExternal = {
  root: 'React',
  commonjs2: 'react',
  commonjs: 'react',
  amd: 'react'
}

module.exports = {
  externals: {
    'react': reactExternal
  },
  module: {
    loaders: [
      { test: /\.js$/, loaders: ['babel-loader'], exclude: /node_modules/ }
    ]
  },
  output: {
    // Set library in release script
    // library: 'Recompose',
    libraryTarget: 'umd'
  },
  resolve: {
    extensions: ['', '.js']
  },
  plugins: [
    new LodashModuleReplacementPlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ]
}
