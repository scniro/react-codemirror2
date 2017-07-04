let express = require('express');
let path = require('path');
let open = require('open');

const app = express();

app.set('port', 8000);

app.use('/react-codemirror2', express.static(__dirname));

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