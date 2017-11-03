[![Build Status](https://travis-ci.org/scniro/react-codemirror2.svg?branch=master)](https://travis-ci.org/scniro/react-codemirror2)
[![Dependency Status](https://img.shields.io/david/scniro/react-codemirror2.svg?label=deps&style=flat-square)](https://david-dm.org/scniro/react-codemirror2)
[![DevDependency Status](https://img.shields.io/david/dev/scniro/react-codemirror2.svg?label=devDeps&style=flat-square)](https://david-dm.org/scniro/react-codemirror2#info=devDependencies)
[![Coverage](https://img.shields.io/coveralls/scniro/react-codemirror2.svg?style=flat-square)](https://coveralls.io/github/scniro/react-codemirror2)
[![NPM Version](https://img.shields.io/npm/v/react-codemirror2.svg?style=flat-square)](https://www.npmjs.com/package/react-codemirror2)

### react-codemirror2

demo @ [scniro.github.io/react-codemirror2](https://scniro.github.io/react-codemirror2/)

> npm install react-codemirror2

## new in 3.0.0

`react-codemirror2` now ships with the notion of an [uncontrolled](https://reactjs.org/docs/uncontrolled-components.html) and [controlled](https://reactjs.org/docs/forms.html#controlled-components) component. `UnControlled` consists of a simple wrapper largely powered by the inner workings of `codemirror` itself, while `Controlled` will demand state management from the user, preventing codemirror changes unless properly handled via `value`. The latter will offer more control and likely be more appropriate with [redux](http://redux.js.org/) heavy apps.

## uncontrolled usage
```jsx
import {UnControlled as CodeMirror} from 'react-codemirror2'

<CodeMirror
  value='<h1>I ♥ react-codemirror2</h1>'
  options={{
    mode: 'xml',
    theme: 'material',
    lineNumbers: true
  }}
  onChange={(editor, data, value) => {
  }}
/>
```

## controlled usage
```jsx
import {Controlled as CodeMirror} from 'react-codemirror2'

<CodeMirror
  value={this.state.value}
  options={options}
  onBeforeChange={(editor, data, value) => {
    this.setState({value});
  }}
  onChange={(editor, data, value) => {
  }}
/>
```

## requiring codemirror resources

- [codemirror](https://www.npmjs.com/package/codemirror)

`codemirror` comes as a [peer dependency](https://nodejs.org/en/blog/npm/peer-dependencies/), meaning you'll need to require it in your project _in addition to_ `react-codemirror2`. This prevents any versioning conflicts that would arise if `codemirror` came as a dependency through this wrapper. It's been observed that version mismatches can cause difficult to trace issues such as sytax highlighting disappearing without any explicit errors/warnings

- additional

Since codemirror ships mostly unconfigured, the user is left with the responsibility for requiring any additional resources should they be necessary. This is often the case when specifying certain [language modes]() and [themes](). How to import/require these assets will vary according to the specifics of your development environment. Below is a sample to include the assets necessary to specify a mode of `xml` (HTML) and a `material` theme.

> note that the base codemirror.css file is required in all use cases

```css
@import 'codemirror/lib/codemirror.css';
@import 'codemirror/theme/material.css';
```

```jsx
import CodeMirror from 'react-codemirror2';
require('codemirror/mode/xml/xml');
require('codemirror/mode/javascript/javascript');
```

## props

- `autoCursor`
> `boolean` if `false`, allow the defaulted internal codemirror cursor position to reset should a new `value` prop be set. Default: `true`
- `autoFocus`
> `boolean` if `true`, set focus to the instance `onSet`. Will be invoked within the `componentDidMount` lifecycle stage. Default: `false`
- `autoScroll`
> `boolean` if `true`, scroll the cursor position into view automatically. Default: `false`
- `className` - sets `class="react-codemirror2 yourClassName"`
- `defineMode`
> pass a custom mode object `{name: 'custom', fn: myModeFn}`
- `options` - see codemirror [configuration](https://codemirror.net/doc/manual.html#config)
- `value` - set component value through props
> must be managed for controlled components

## props cont. (wrapped codemirror [programming api](https://codemirror.net/doc/manual.html#api))

- `cursor` - *[setCursor](https://codemirror.net/doc/manual.html#setCursor)*
> will programmatically set cursor to the position specified
```jsx
<CodeMirror
  [...]
  cursor={{
    line: 5,
    ch: 10
  }}
  onCursor={(editor, data) => {}}
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
  onScroll={(editor, data) => {}}
/>
```
- `selection={array<{anchor, head}>}` - *[setSelections](https://codemirror.net/doc/manual.html#setSelections)*
> will programmatically select the ranges specified
```jsx
<CodeMirror
  [...]
  selection={[{
    anchor: {ch: 8, line: 5},
    head: {ch: 37, line: 5}
  }]}
  onSelection={(editor, data) => {}}
/>
```

## events

- `editorDidConfigure(editor)`
- `editorDidMount(editor, next)`
> invoking optional `next()` will trigger `editorDidConfigure`
- `editorWillMount()`
- `editorWillUnmount(editor)`
- `onBeforeChange(editor, data, value)` **[controlled]**
> required - hook to manage state and update `value`
- `onBeforeChange(editor, data, value, next)` **[uncontrolled]**
> optional - if defined, `next()` must be invoked to trigger `onChange`.
- `onChange(editor, data, value)`


## events cont. [wrapped codemirror events](https://codemirror.net/doc/manual.html#events)

- `onBlur(editor, event)` - *[blur](https://codemirror.net/doc/manual.html#event_blur)*
- `onCursor(editor, data)`- *[cursorActivity](https://codemirror.net/doc/manual.html#event_doc_cursorActivity)*
- `onCursorActivity(editor)` - *[cursorActivity](https://codemirror.net/doc/manual.html#event_cursorActivity)*
- `onDragEnter(editor, event)` - *[dragenter](https://codemirror.net/doc/manual.html#event_dom)*
- `onDragOver(editor, event)` - *[dragover](https://codemirror.net/doc/manual.html#event_dom)*
- `onDrop(editor, event)` - *[drop](https://codemirror.net/doc/manual.html#event_dom)*
- `onFocus(editor, event)` - *[focus](https://codemirror.net/doc/manual.html#event_focus)*
- `onGutterClick(editor, lineNumber, gutter, event)` - *[gutterClick](https://codemirror.net/doc/manual.html#event_gutterClick)*
- `onKeyDown(editor, event)` - *[keydown](https://codemirror.net/doc/manual.html#event_dom)*
- `onKeyPress(editor, event)` - *[keypress](https://codemirror.net/doc/manual.html#event_dom)*
- `onKeyUp(editor, event)` - *[keyup](https://codemirror.net/doc/manual.html#event_dom)*
- `onScroll(editor, data)` - *[scroll](https://codemirror.net/doc/manual.html#event_scroll)*
- `onSelection(editor, data)` - *[beforeSelectionChange](https://codemirror.net/doc/manual.html#event_doc_beforeSelectionChange)*
- `onUpdate(editor, event)` - *[update](https://codemirror.net/doc/manual.html#event_update)*
- `onViewportChange(editor, from, to)` - *[viewportChange](https://codemirror.net/doc/manual.html#event_viewportChange)*

[MIT](./LICENSE) © 2017 [scniro](https://github.com/scniro)
