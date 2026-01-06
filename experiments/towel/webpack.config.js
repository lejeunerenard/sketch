const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: {
    index: './index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style', 'css']
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.json'],
    alias: {}
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Development',
    })
  ],
  devServer: {
    static: path.resolve(__dirname, 'dist')
  },
  optimization: {
   runtimeChunk: 'single',
  }
}
