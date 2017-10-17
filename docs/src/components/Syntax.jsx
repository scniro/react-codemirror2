import React from 'react';

let prism = require('prismjs');

export default class Syntax extends React.Component {

  constructor(props) {
    super(props);

    this.controlled = `
require('codemirror/lib/codemirror.css');
require('codemirror/theme/material.css');
require('codemirror/theme/neat.css');
require('codemirror/mode/xml/xml.js');
require('codemirror/mode/javascript/javascript.js');

import {Controlled as CodeMirror} from 'react-codemirror2';

<CodeMirror
  value={this.state.value}
  options={options}
  onBeforeChange={(editor, data, value) => {
    this.setState({value});
  }}
  onChange={(editor, value) => {
    console.log('controlled', {value});
  }}
/>`.trim();

    this.uncontrolled = `
require('codemirror/lib/codemirror.css');
require('codemirror/theme/material.css');
require('codemirror/theme/neat.css');
require('codemirror/mode/xml/xml.js');
require('codemirror/mode/javascript/javascript.js');

import {UnControlled as CodeMirror} from 'react-codemirror2';

<CodeMirror
  value={value}
  options={options}
  onChange={(editor, value) => {
    console.log('uncontrolled', {value});
  }}
/>`.trim();
  }

  tokenize() {

    let code = prism.highlight(this.props.controlled ? this.controlled : this.uncontrolled, prism.languages.jsx);

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
