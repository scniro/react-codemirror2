3.0.0
==================
* ships with typings
* [`onSet`, `onChange`, `onBeforeSet`, `onBeforeChange`] deprecated, now => [`onChange`, `onChangeInternal`, `onBeforeChange`, `onBeforeSet`]
* [`resetCursorOnSet`, `autoScrollCursorOnSet`] deprecated, now => [`autoCursor`, `autoScroll`]
* add `autoFocus`
* modify return of `onSelection`: this.editor, data.ranges) now => (this.editor, data)

2.0.2
==================
* fixed https://github.com/scniro/react-codemirror2/issues/14
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