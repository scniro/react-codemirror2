let path = require('path');
let context = path.resolve(__dirname, '..');

let config = {

  entry: path.normalize(`${context}/demo/index.jsx`),
  output: {
    path: path.normalize(`${context}/demo/`),
    filename: 'bundle.js'
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
    }]
  }
};

module.exports = config;