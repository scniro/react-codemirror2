import React from 'react';
let codemirror = require('codemirror');

export default class CodeMirror extends React.Component {

  constructor(props) {
    super(props);

    this.hydrated = false;

    this.initCb = () => {
      if (this.props.editorDidConfigure) {
        this.props.editorDidConfigure(this.editor);
      }
    }
  }

  componentWillMount() {
    if (this.props.editorWillMount) {
      this.props.editorWillMount();
    }
  }

  componentDidMount() {

    this.editor = codemirror(this.ref);

    this.editor.on('change', (cm, metadata) => {
      if (this.props.onValueChange && this.hydrated) {
        this.props.onValueChange(this.editor, metadata, this.editor.getValue());
      }
    });

    if (this.props.onCursorActivity) {
      this.editor.on('cursorActivity', (cm) => {
        this.props.onViewportChange(this.editor);
      });
    }

    if (this.props.onViewportChange) {
      this.editor.on('viewportChange', (cm, start, end) => {
        this.props.onViewportChange(this.editor, start, end);
      });
    }

    if (this.props.onGutterClick) {
      this.editor.on('gutterClick', (cm, lineNumber, event) => {
        this.props.onGutterClick(this.editor, lineNumber, event);
      });
    }

    if (this.props.onFocus) {
      this.editor.on('focus', (cm, event) => {
        this.props.onFocus(this.editor, event);
      });
    }

    if (this.props.onBlur) {
      this.editor.on('blur', (cm, event) => {
        this.props.onBlur(this.editor, event);
      });
    }

    if (this.props.onScroll) {
      this.editor.on('scroll', (cm, event) => {
        this.props.onScroll(this.editor, event);
      });
    }

    if (this.props.onUpdate) {
      this.editor.on('update', (cm, event) => {
        this.props.onUpdate(this.editor, event);
      });
    }

    if (this.props.onKeyDown) {
      this.editor.on('keydown', (cm, event) => {
        this.props.onKeyDown(this.editor, event);
      });
    }

    if (this.props.onKeyUp) {
      this.editor.on('keyup', (cm, event) => {
        this.props.onKeyUp(this.editor, event);
      });
    }

    if (this.props.onKeyPress) {
      this.editor.on('keypress', (cm, event) => {
        this.props.onKeyPress(this.editor, event);
      });
    }

    if (this.props.onDragEnter) {
      this.editor.on('dragenter', (cm, event) => {
        this.props.onDragEnter(this.editor, event);
      });
    }

    if (this.props.onDragOver) {
      this.editor.on('dragover', (cm, event) => {
        this.props.onDragOver(this.editor, event);
      });
    }

    if (this.props.onDrop) {
      this.editor.on('drop', (cm, event) => {
        this.props.onDrop(this.editor, event);
      });
    }

    this.hydrate(this.props);

    if (this.props.editorDidMount) {
      this.props.editorDidMount(this.editor, this.initCb);
    }
  }

  componentWillReceiveProps(nextProps) {

    if (this.props.value !== nextProps.value) {
      this.hydrated = false;
    }

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
      this.props.editorDidConfigure(this.editor);
    }

    if (this.props.value && !this.hydrated) {
      this.editor.setValue(props.value);

      if (this.props.onValueSet) {
        this.props.onValueSet(this.editor, this.editor.getValue());
      }
    }

    this.hydrated = true;
  }

  render() {

    let className = this.props.className ? `react-codemirror2 ${this.props.className}` : 'react-codemirror2';

    return (
      <div className={className} ref={(self) => this.ref = self}/>
    )
  }
}