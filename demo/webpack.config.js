import webpack from 'webpack';
import path from 'path';

export default {
  devtool: 'eval',
  entry: [
    'webpack-hot-middleware/client?reload=true',
    path.resolve(__dirname, 'index.jsx')
  ],
  target: 'web',
  output: {
    path: __dirname + '/demo',
    publicPath: '/',
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'demo')
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
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
