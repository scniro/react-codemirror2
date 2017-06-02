[![NPM Version](https://img.shields.io/npm/v/react-codemirror2.svg?style=flat-square)](https://www.npmjs.com/package/react-codemirror2)
[![Build Status](https://travis-ci.org/scniro/react-codemirror2.svg?branch=master)](https://travis-ci.org/scniro/react-codemirror2)

https://travis-ci.org/scniro/react-codemirror2.svg?branch=master

### react-codemirror2

better docs coming soon. all props are optional...

```
import CodeMirror from 'react-codemirror2'

<CodeMirror
  defaultValue='react-codemirror2'
  options={{
    theme: 'material',
    lineNumbers: true
  }}
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
  }}
/>
```