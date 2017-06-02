import React from 'react';
import {render} from 'react-dom';
import CodeMirror from '../src/react-codemirror2.jsx';

require('./index.scss');

render(
  <div>
    <CodeMirror
      defaultValue='react-codemirror2'
      options={{theme: 'material', lineNumbers: true}}
      editorWillMount={(cm) => {
      }}
      editorDidMount={(cm) => {
      }}
      editorDidConfigure={(cm) => {
      }}
      editorWillUnmount={(cm) => {
      }}
      onSetDefaultValue={(defaultValue) => {
      }}
      onChange={(cm, metadata, internalValue) => {
      }}
      onCursorActivity={() => {
      }}
      onViewportChange={(cm, viewportStart, viewportEnd) => {
      }}
      onGutterClick={(cm, lineNumber, event) => {
      }}
      onFocus={() => {
      }}
      onBlur={() => {
      }}
      onScroll={() => {
      }}
      onUpdate={() => {
      }}
      onKeyDown={(cm, event) => {
      }}
      onKeyUp={(cm, event) => {
      }}
      onKeyPress={(cm, event) => {
      }}
      onDragEnter={(cm, event) => {
      }}
      onDragOver={(cm, event) => {
      }}
      onDrop={(cm, event) => {
      }}/>
  </div>
  , document.getElementById('app'));