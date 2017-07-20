[![Build Status](https://travis-ci.org/scniro/react-codemirror2.svg?branch=master)](https://travis-ci.org/scniro/react-codemirror2)
[![Dependency Status](https://img.shields.io/david/scniro/react-codemirror2.svg?label=deps&style=flat-square)](https://david-dm.org/scniro/react-codemirror2)
[![DevDependency Status](https://img.shields.io/david/dev/scniro/react-codemirror2.svg?label=devDeps&style=flat-square)](https://david-dm.org/scniro/react-codemirror2#info=devDependencies)
[![NPM Version](https://img.shields.io/npm/v/react-codemirror2.svg?style=flat-square)](https://www.npmjs.com/package/react-codemirror2)

### react-codemirror2

demo @ [scniro.github.io/react-codemirror2](https://scniro.github.io/react-codemirror2/)

> npm install react-codemirror2

## basic usage
```jsx
import CodeMirror from 'react-codemirror2'

<CodeMirror
  value='<h1>I ♥ react-codemirror2</h1>'
  options={{
    mode: 'xml',
    theme: 'material',
    lineNumbers: true
  }}
  onValueChange={(editor, metadata, value) => {
  }}
/>
```

## requiring codemirror resources

Since codemirror ships mostly unconfigured, the user is left with the responsibility for requiring any additional resources should they be necessary. This is often the case when specifying certain [language modes]() and [themes](). How to import/require these assets will vary according to the specifics of your development environment. Below is a sample to include the assets necessary to specify a mode of `xml` (HTML) and a `material` theme.

> note that the base codemirror.css file is required in all use cases

```css
@import '~/node_modules/codemirror/lib/codemirror.css';
@import '~/node_modules/codemirror/theme/material.css';
```

```jsx
import CodeMirror from 'react-codemirror2';
require('codemirror/mode/xml/xml');
require('codemirror/mode/javascript/javascript');
```

## props

- `className` - sets `class="react-codemirror2 yourClassName"`
- `options` - see codemirror [configuration](https://codemirror.net/doc/manual.html#config)
- `value` - set component value through props
> triggers `onValueSet`
- `resetCursorOnSet`
> `boolean` reset the internal codemirror cursor position should a new `value` prob be set. Default: `false`

## props cont. (wrapped codemirror [programming api](https://codemirror.net/doc/manual.html#api))

- `selection={array<{anchor, head}>}` - *[setSelections](https://codemirror.net/doc/manual.html#setSelections)*
> will programmatically select the ranges specified
```jsx
<CodeMirror
  [...]
  selection={[{
    anchor: {ch: 8, line: 5},
    head: {ch: 37, line: 5}
  }]}
  onSelection={(editor, ranges) => {}}
/>
```
- `scroll` - *[scrollTo](https://codemirror.net/doc/manual.html#scrollTo)*
> will programmatically scroll to the specified coordinate
```jsx
<CodeMirror
  [...]
  scroll={{
    x: 50,
    y: 50
  }}
  onScroll={(editor, position) => {}}
/>
```
- `cursor` - *[setCursor](https://codemirror.net/doc/manual.html#setCursor)*
> will programmatically set cursor to the position specified
```jsx
<CodeMirror
  [...]
  cursor={{
    line: 5,
    ch: 10
  }}
  onCursor={(editor, position) => {}}
/>
```

## events

- `editorWillMount()`
- `editorDidMount(editor, next)`
> calling optional `next()` will trigger `editorDidConfigure`
- `editorDidConfigure(editor)`
- `onValueSet(editor, value)`
> returns the initial value via `value`
- `editorWillUnmount(editor)`

## events cont. [wrapped codemirror events](https://codemirror.net/doc/manual.html#events)

- `onValueChange(editor, metadata, value)`
> returns the internal value of the editor
- `onCursorActivity(editor)`
- `onViewportChange(editor, viewportStart, viewportEnd)`
- `onGutterClick(editor, lineNumber, event)`
- `onFocus(editor, event)`
- `onBlur(editor, event)`
- `onUpdate(editor, event)`
- `onKeyDown(editor, event)`
- `onKeyUp(editor, event)`
- `onKeyPress(editor, event)`
- `onDragEnter(editor, event)`
- `onDragOver(editor, event)`
- `onDrop(editor, event)`
- `onSelection(editor, ranges)`
- `onScroll(editor, position)`
- `onCursor(editor, position)`







[MIT](./LICENSE) © 2017 [scniro](https://github.com/scniro)