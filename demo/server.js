let express = require('express');
let app = express();

app.set('port', 5000);

app.use(express.static('.'));

app.use(function (req, res, next) {
  if (req.path.substr(-1) === '/' && req.path.length > 1) {
    let query = req.url.slice(req.path.length);
    res.redirect(301, req.path.slice(0, -1) + query);
  } else {
    next();
  }
});

app.all('/*', function (req, res, next) {
  res.sendFile(`${__dirname}/index.html`)
});

app.listen(app.get('port'), function () {
  console.log(`react-codemirror2 demo listening on port ${app.get('port')}`);
});