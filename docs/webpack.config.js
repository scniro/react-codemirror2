'use strict';

let path = require('path');

let config = {
  devtool: 'eval',
  entry: path.resolve(__dirname, 'src', 'index.jsx'),
  output: {
    path: __dirname,
    publicPath: '/',
    filename: 'app.js'
  },
  module: {
    rules: [{
      test: /\.jsx?/,
      exclude: /(node_modules)/,
      use: [{
        loader: 'babel-loader'
      }]
    }, {
      test: /(\.scss)$/,
      exclude: /(node_modules)/,
      use: [{
        loader: 'style-loader'
      }, {
        loader: 'css-loader'
      }, {
        loader: 'sass-loader'
      }]
    }, {
      test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
      exclude: /(node_modules)/,
      use: [{
        loader: 'file-loader'
      }]
    }]
  },
};


module.exports = config;