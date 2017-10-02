import React from 'react';

let prism = require('prismjs');

export default class Syntax extends React.Component {

  constructor(props) {
    super(props);

    this.code = `
require('codemirror/lib/codemirror.css'); // e.g. webpack css loader
require('codemirror/theme/material.css');
require('codemirror/theme/neat.css');
require('codemirror/mode/xml/xml.js');
require('codemirror/mode/javascript/javascript.js');

import 'Codemirror' from 'react-codemirror2';

<CodeMirror
  value={this.value}
  options={{
    mode: this.mode
    theme: this.theme,
    lineNumbers: true
  }}
  onSet={(editor, value) => {
    console.log('set', {value});
  }}
  onChange={(editor, metadata, value) => {
    console.log('change', {value});
  }}
/>`.trim();

  }

  tokenize() {

    let code = prism.highlight(this.code, prism.languages.jsx);

    return {
      __html: code
    };
  };

  render() {

    return (
      <pre className='syntax-block'>
        <code dangerouslySetInnerHTML={this.tokenize()}/>
      </pre>
    )
  }
}
