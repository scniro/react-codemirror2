'use strict';

const pkg = require('../package.json');
const webpack = require('webpack');
const path = require('path');

const config = {
  devtool: 'eval',
  entry: path.resolve(__dirname, 'src', 'index.jsx'),
  output: {
    path: __dirname,
    publicPath: '/',
    filename: 'app.min.js'
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
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'BUILD': process.env['BUILD']
      },
      'REACT_CODEMIRROR2_V': JSON.stringify(pkg.version)
    })
  ]
};

module.exports = config;
