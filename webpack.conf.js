const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './lib/Element.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/',
    filename: 'js/bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './view/testElement.html'),
      filename: './index.html',
      title: 'V-Dom',
      inject: false
    })
  ],
  devServer: {
    contentBase: path.resolve(__dirname, './dist'),
    port: 9999,
    open: true
  }
};