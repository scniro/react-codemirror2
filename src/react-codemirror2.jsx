import React from 'react';
let codemirror = require('codemirror');

export default class CodeMirror extends React.Component {

  constructor(props) {
    super(props);

    this.hydrated = false;
    this.continuePreSet = false;
    this.continuePreChange = false;

    this.onBeforeChangeCb = () => {

      this.continuePreChange = true;
    };

    this.onBeforeSetCb = () => {

      this.continuePreSet = true;
    };

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

    /* deprecation warnings per 1.0.0 release */
    if (this.props.onValueChange) {
      console.warn('`onValueChange` has been deprecated. Please use `onChange` instead');
    }

    if (this.props.onValueSet) {
      console.warn('`onValueSet` has been deprecated. Please use `onSet` instead');
    }
    /* end deprecation warnings per 1.0.0 release */

    if (this.props.defineMode) {
      if (this.props.defineMode.name && this.props.defineMode.fn) {
        codemirror.defineMode(this.props.defineMode.name, this.props.defineMode.fn);
      }
    }

    this.editor = codemirror(this.ref);

    this.editor.on('beforeChange', (cm, changeObj) => {
      if (this.props.onBeforeChange && this.hydrated) {
        this.props.onBeforeChange(this.editor, changeObj, this.onBeforeChangeCb);
      }
    });

    this.editor.on('change', (cm, metadata) => {

      if (this.props.onChange && this.hydrated) {

        if (this.props.onBeforeChange) {
          if (this.continuePreChange) {
            this.props.onChange(this.editor, metadata, this.editor.getValue());
          }
        } else {
          this.props.onChange(this.editor, metadata, this.editor.getValue());
        }
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

    if (this.props.onSelection) {
      this.editor.on('beforeSelectionChange', (cm, meta) => {
        this.props.onSelection(this.editor, meta.ranges);
      })
    }

    if (this.props.onScroll) {
      this.editor.on('scroll', (cm) => {

        let meta = this.editor.getScrollInfo();

        this.props.onScroll(this.editor, {
          x: meta.left,
          y: meta.top
        });
      })
    }

    if (this.props.onCursor) {
      this.editor.on('cursorActivity', (cm) => {

        let meta = this.editor.getCursor();

        this.props.onCursor(this.editor, {
          line: meta.line,
          ch: meta.ch
        });
      })
    }

    this.hydrate(this.props);

    // commands
    if (this.props.selection) {
      this.editor.setSelections(this.props.selection);
    }

    if (this.props.cursor) {
      this.editor.focus();
      this.editor.setCursor(this.props.cursor);
    }

    if (this.props.scroll) {
      this.editor.scrollTo(this.props.scroll.x, this.props.scroll.y);
    }

    if (this.props.editorDidMount) {
      this.props.editorDidMount(this.editor, this.initCb);
    }
  }

  componentWillReceiveProps(nextProps) {

    if (this.props.value !== nextProps.value) {
      this.hydrated = false;
    }

    if (!this.props.resetCursorOnSet) {
      this.cursorPos = this.editor.getCursor();
    }

    this.hydrate(nextProps);

    if (!this.props.resetCursorOnSet) {

      !this.props.autoScrollCursorOnSet && this.props.autoScrollCursorOnSet !== undefined ?
        this.editor.setCursor(this.cursorPos, null, {scroll: false}) : this.editor.setCursor(this.cursorPos);
    }
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

    if (!this.hydrated) {

      this.editor.setValue(props.value || '');

      if (this.props.onBeforeSet) {
        this.props.onBeforeSet(this.editor, this.onBeforeSetCb);
      }

      if (this.props.onBeforeSet) {

        if (this.continuePreSet && this.props.onSet) {

          this.props.onSet(this.editor, this.editor.getValue());
        }
      } else {
        if (this.props.onSet) {
          this.props.onSet(this.editor, this.editor.getValue());
        }
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