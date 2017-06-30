import React from 'react';
let codemirror = require('codemirror');

export default class CodeMirror extends React.Component {

  constructor(props) {
    super(props);

    this.hydrated = false;
    this.initCb = () => {

      this.props.editorDidConfigure(this.editor);
    }
  }

  componentWillMount() {
    if (this.props.editorWillMount) {
      this.props.editorWillMount(this.editor);
    }
  }

  componentDidMount() {

    this.editor = codemirror(this.ref);

    this.editor.on('change', (cm, metadata) => {
      if (this.props.onChange && this.hydrated) {
        this.props.onChange(this.editor, metadata, this.editor.getValue());
      }
    });

    if(this.props.onCursorActivity) {
      this.editor.on('cursorActivity', this.props.onCursorActivity);
    }

    if(this.props.onViewportChange) {
      this.editor.on('viewportChange', (cm, start, end) => {
        this.props.onViewportChange(this.editor, start, end);
      });
    }

    if(this.props.onGutterClick) {
      this.editor.on('gutterClick', (cm, lineNumber, event) => {
        this.props.onGutterClick(this.editor, lineNumber, event);
      });
    }

    if(this.props.onFocus) {
      this.editor.on('focus', this.props.onFocus);
    }

    if(this.props.onBlur) {
      this.editor.on('blur', this.props.onBlur);
    }

    if(this.props.onScroll) {
      this.editor.on('scroll', this.props.onScroll);
    }

    if(this.props.onUpdate) {
      this.editor.on('update', this.props.onUpdate);
    }

    if(this.props.onKeyDown) {
      this.editor.on('keydown', (cm, event) => {
        this.props.onKeyDown(this.editor, event);
      });
    }

    if(this.props.onKeyUp) {
      this.editor.on('keyup', (cm, event) => {
        this.props.onKeyUp(this.editor, event);
      });
    }

    if(this.props.onKeyPress) {
      this.editor.on('keypress', (cm, event) => {
        this.props.onKeyPress(this.editor, event);
      });
    }

    if(this.props.onDragEnter) {
      this.editor.on('dragenter', (cm, event) => {
        this.props.onDragEnter(this.editor, event);
      });
    }

    if(this.props.onDragOver) {
      this.editor.on('dragover', (cm, event) => {
        this.props.onDragOver(this.editor, event);
      });
    }

    if(this.props.onDrop) {
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

    if (this.props.defaultValue && !this.hydrated) {
      this.editor.setValue(props.defaultValue);

      if (this.props.onSetDefaultValue) {
        this.props.onSetDefaultValue(this.editor.getValue());
      }
    }

    this.hydrated = true;
  }

  render() {
    return (
      <div ref={(self) => this.ref = self}/>
    )
  }
}