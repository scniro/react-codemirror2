const fs = require('fs');
const babel = require('babel-core');
const path = require('path');
const root = path.resolve(__dirname, '..');
const Transform = require('stream').Transform;

const transpile = new Transform({
  transform(chunk, encoding, cb) {

    let transformed = babel.transform(chunk.toString(), {plugins: ['transform-react-jsx']})

    this.push(transformed.code)
    cb();
  }
});

let rs = fs.createReadStream(`${root}/src/react-codemirror2.jsx`);
let ws = fs.createWriteStream(`${root}/index.js`);

rs.pipe(transpile).pipe(ws);

