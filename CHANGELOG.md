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