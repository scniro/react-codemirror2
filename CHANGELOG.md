3.0.6
==================
* https://github.com/scniro/react-codemirror2/issues/28

3.0.5
==================
* https://github.com/scniro/react-codemirror2/issues/31 (take 2)

3.0.4
==================
* https://github.com/scniro/react-codemirror2/issues/31

3.0.3
==================
* https://github.com/scniro/react-codemirror2/pull/27

3.0.2
==================
* https://github.com/scniro/react-codemirror2/issues/22

3.0.1
==================
* fixes https://github.com/scniro/react-codemirror2/issues/25

3.0.0
==================
* typings
* [`onSet`, onBeforeSet`] deprecated [removed]
* [`resetCursorOnSet`, `autoScrollCursorOnSet`] deprecated, now => [`autoCursor`, `autoScroll`]
* add `autoFocus`
* modify return of `onSelection`: this.editor, data.ranges) now => (this.editor, data)
* split component into two per usage, `UnControlled` & `Controlled`
* fixes  https://github.com/scniro/react-codemirror2/issues/22

2.0.2
==================
* fixes https://github.com/scniro/react-codemirror2/issues/14
* remove deprecation warnings from 1.x

2.0.1
==================
* bump `peerDependencies` to support react 16.x

2.0.0
==================
* deprecate 1.x due to dependency conflicts occurring from over-strict versioning of codemirror as a `dependency`. Codemirror is now designated as a `peerDependency`

1.0.0
==================
* [`onValueSet`, `onValueChange`] deprecated, now => [`onSet`, `onChange`];
* add `onBeforeChange` `onBeforeSet`
* add `defineMode`
