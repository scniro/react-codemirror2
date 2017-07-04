[![Build Status](https://travis-ci.org/scniro/react-codemirror2.svg?branch=master)](https://travis-ci.org/scniro/react-codemirror2)
[![Dependency Status](https://img.shields.io/david/scniro/react-codemirror2.svg?label=deps&style=flat-square)](https://david-dm.org/scniro/react-codemirror2)
[![DevDependency Status](https://img.shields.io/david/dev/scniro/react-codemirror2.svg?label=devDeps&style=flat-square)](https://david-dm.org/scniro/react-codemirror2#info=devDependencies)
[![NPM Version](https://img.shields.io/npm/v/react-codemirror2.svg?style=flat-square)](https://www.npmjs.com/package/react-codemirror2)

### react-codemirror2

[scniro.github.io/react-codemirror2](https://scniro.github.io/react-codemirror2/)

Better docs coming soon. All props are optional.

```jsx
import CodeMirror from 'react-codemirror2'

<CodeMirror
  defaultValue='I <3 react-codemirror2'
  options={{
    theme: this.props.theme,
    lineNumbers: true
  }}
  editorWillMount={(codemirror) => {
  }}
  editorDidMount={(editor, next) => {

    editor.setOption('htmlMode', true); // alternative to passing props
    next(); // optional: will trigger editorDidConfigure
  }}
  editorDidConfigure={(editor) => {
  }}
  editorWillUnmount={(editor) => {
  }}
  onSetDefaultValue={(defaultValue) => {
  }}
  onChange={(editor, metadata, internalValue) => {

    console.log(internalValue); // editor value
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
  }}
/>
```