import express from 'express';
import webpack from 'webpack';
import path from 'path';
import config from './webpack.config.js';
import open from 'open';

const app = express();
const compiler = webpack(config);

app.set('port', 8000);

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

app.all('/*', function (req, res) {
  res.sendFile(path.join(__dirname, './index.html'));
});

app.listen(app.get('port'), function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log(`react-codemirror2 demo listening on port ${app.get('port')}`);
    open(`http://localhost:${app.get('port')}`);
  }
});