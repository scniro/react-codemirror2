import React from 'react';
let codemirror = require('codemirror');

export default class CodeMirror extends React.Component {

  componentDidMount() {

    this.editor = codemirror(this.ref);
    this.editor.on('change', () => this.props.onChange(this.editor.getValue()));

    this.hydrate(this.props);
  }

  componentWillReceiveProps(nextProps) {

    this.hydrate(nextProps);
  }

  hydrate(props) {

    Object.keys(props.options || {}).forEach(key => this.editor.setOption(key, props.options[key]));
    this.editor.setValue(props.value || '');
  }

  render() {
    return React.createElement('div', { ref: self => this.ref = self });
  }
}