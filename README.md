[![NPM Version](https://img.shields.io/npm/v/react-codemirror2.svg?style=flat-square)](https://www.npmjs.com/package/react-codemirror2)

### react-codemirror2

```
import CodeMirror from 'react-codemirror2'

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
  }}
/>
```

// better docs coming soon. all props are optional...