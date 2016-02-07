'use strict'

module.exports = {
  entry: {
    app: './index.js'
  },
  output: {
    path: __dirname + '/dist',
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
  }
}
