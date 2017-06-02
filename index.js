import React from 'react';
let codemirror = require('codemirror');

export default class CodeMirror extends React.Component {

  constructor(props) {
    super(props);

    this.initHydration = false;
  }

  componentWillMount() {
    if (this.props.editorWillMount) {
      this.props.editorWillMount(codemirror);
    }
  }

  componentDidMount() {

    this.editor = codemirror(this.ref);

    this.editor.on('change', (cm, metadata) => {
      if (this.props.onChange && this.initHydration) {
        this.props.onChange(cm, metadata, this.editor.getValue());
      }
    });

    if (this.props.onCursorActivity) {
      this.editor.on('cursorActivity', this.props.onCursorActivity);
    }

    if (this.props.onViewportChange) {
      this.editor.on('viewportChange', (cm, start, end) => {
        this.props.onViewportChange(cm, start, end);
      });
    }

    if (this.props.onGutterClick) {
      this.editor.on('gutterClick', (cm, lineNumber, event) => {
        this.props.onGutterClick(cm, lineNumber, event);
      });
    }

    if (this.props.onFocus) {
      this.editor.on('focus', this.props.onFocus);
    }

    if (this.props.onBlur) {
      this.editor.on('blur', this.props.onBlur);
    }

    if (this.props.onScroll) {
      this.editor.on('scroll', this.props.onScroll);
    }

    if (this.props.onUpdate) {
      this.editor.on('update', this.props.onUpdate);
    }

    if (this.props.onKeyDown) {
      this.editor.on('keydown', (cm, event) => {
        this.props.onKeyDown(cm, event);
      });
    }

    if (this.props.onKeyUp) {
      this.editor.on('keyup', (cm, event) => {
        this.props.onKeyUp(cm, event);
      });
    }

    if (this.props.onKeyPress) {
      this.editor.on('keypress', (cm, event) => {
        this.props.onKeyPress(cm, event);
      });
    }

    if (this.props.onDragEnter) {
      this.editor.on('dragenter', (cm, event) => {
        this.props.onDragEnter(cm, event);
      });
    }

    if (this.props.onDragOver) {
      this.editor.on('dragover', (cm, event) => {
        this.props.onDragOver(cm, event);
      });
    }

    if (this.props.onDrop) {
      this.editor.on('drop', (cm, event) => {
        this.props.onDrop(cm, event);
      });
    }

    this.hydrate(this.props);

    if (this.props.editorDidMount) {
      this.props.editorDidMount(codemirror);
    }
  }

  componentWillReceiveProps(nextProps) {

    this.hydrate(nextProps);
  }

  componentWillUnmount() {

    if (this.props.editorWillUnmount) {
      this.props.editorWillUnmount(codemirror);
    }
  }

  hydrate(props) {

    Object.keys(props.options || {}).forEach(key => this.editor.setOption(key, props.options[key]));

    if (this.props.editorDidConfigure) {
      this.props.editorDidConfigure(codemirror);
    }

    if (this.props.defaultValue && !this.initHydration) {
      this.editor.setValue(props.defaultValue);

      if (this.props.onSetDefaultValue) {
        this.props.onSetDefaultValue(this.editor.getValue());
      }
    }

    this.initHydration = true;
  }

  render() {
    return React.createElement('div', { ref: self => this.ref = self });
  }
}