'use strict'

import path from 'path'
import AppCachePlugin from 'appcache-webpack-plugin'

module.exports = {
  entry: {
    app: './index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loaders: ['style', 'css']
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ],
    noParse: []
  },
  resolve: {
    extensions: ['', '.js', '.json'],
    alias: {}
  },
  plugins: [
    new AppCachePlugin({
      network: null,
      settings: ['prefer-online'],
      output: 'towel.appcache'
    })
  ]
}
