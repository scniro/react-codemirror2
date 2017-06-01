import React from 'react';
import {render} from 'react-dom';
import CodeMirror from '../src/react-codemirror2.jsx';

require('./index.scss');

render(
  <CodeMirror
    value='foo'
    options={{theme: 'material', viewportMargin: Infinity}}
    onChange={(value) => console.log(value)}/>
  , document.getElementById('app'));