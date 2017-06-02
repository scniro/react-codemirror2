import React from 'react';
import {render} from 'react-dom';
import CodeMirror from '../src/react-codemirror2.jsx';

require('./index.scss');

render(
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
    onChange={(internalValue) => {
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
    }}/>
  , document.getElementById('app'));