import React from 'react';
import {connect} from 'react-redux';
import CodeMirror from '../../src/react-codemirror2.jsx';

require('../../node_modules/codemirror/mode/xml/xml.js');

class Editor extends React.Component {

  constructor(props) {
    super(props)

    this.defaultValue =
`<div class="main">
  <ul>
    <li>1</li>
    <li>2</li>
    <li>3</li>
  </ul>
</div>`;
  }

  render() {

    return (
      <CodeMirror
        defaultValue={this.defaultValue}
        options={{theme: this.props.theme, lineNumbers: true}}
        editorWillMount={(codemirror) => {
        }}
        editorDidMount={(editor, next) => {

          // modify the instance on mount alternative to passing down through props
          editor.setOption('htmlMode', true);
          // optional callback: will trigger `editorDidConfigure callback`
          next();
        }}
        editorDidConfigure={(editor) => {
        }}
        editorWillUnmount={(editor) => {
        }}
        onSetDefaultValue={(defaultValue) => {
        }}
        onChange={(editor, metadata, internalValue) => {

          // editor value
          console.log(internalValue)
        }}
        onCursorActivity={() => {
        }}
        onViewportChange={(editor, viewportStart, viewportEnd) => {
        }}
        onGutterClick={(editor, lineNumber, event) => {
        }}
        onFocus={() => {
        }}
        onBlur={() => {
        }}
        onScroll={() => {
        }}
        onUpdate={() => {
        }}
        onKeyDown={(editor, event) => {
        }}
        onKeyUp={(editor, event) => {
        }}
        onKeyPress={(editor, event) => {
        }}
        onDragEnter={(editor, event) => {
        }}
        onDragOver={(editor, event) => {
        }}
        onDrop={(editor, event) => {
        }}/>
    )
  }
}

function mapState(state) {
  return {
    theme: state.app.theme,
  }
}

export default connect(mapState)(Editor)