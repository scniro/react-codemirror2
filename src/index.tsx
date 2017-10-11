import * as React from 'react';
import * as codemirror from 'codemirror';

export interface IDefineModeOptions {
  name: string;
  fn: () => any;
}

export interface ISetScrollOptions {
  x: number;
  y: number;
}

export interface ISetSelectionOptions {
  anchor: codemirror.Position,
  head: codemirror.Position
}

export interface IInstance extends codemirror.Editor, codemirror.Doc {

}

export interface ICodeMirror {
  value?: string;
  className?: string;
  defineMode?: IDefineModeOptions;
  editorDidConfigure?: (editor: codemirror.Editor) => void;
  cursor?: codemirror.Position;
  onSet?: (editor: codemirror.Editor, value: string) => void;
  onBeforeSet?: (editor: codemirror.Editor, cb: () => void) => void;
  autoScrollCursorOnSet?: boolean;
  resetCursorOnSet?: boolean;
  scroll?: ISetScrollOptions;
  selection?: Array<ISetSelectionOptions>;
  onGutterClick?: (editor: codemirror.Editor, lineNumber: number, gutter: string, event: Event) => void;
  onBeforeChange?: (editor: codemirror.Editor, data: codemirror.EditorChange, cb: () => void) => void;
  onChange?: (editor: codemirror.Editor, data: codemirror.EditorChange, value: string) => void;
  onCursor?: (editor: codemirror.Editor, data: codemirror.Position) => void;
  onScroll?: (editor: codemirror.Editor, data: codemirror.ScrollInfo) => void;
  onDrop?: (editor: codemirror.Editor, event: Event) => void;
  onDragOver?: (editor: codemirror.Editor, event: Event) => void;
  onDragEnter?: (editor: codemirror.Editor, event: Event) => void;
  onSelection?: (editor: codemirror.Editor, ranges: any) => void;
  onKeyPress?: (editor: codemirror.Editor, event: Event) => void;
  onKeyDown?: (editor: codemirror.Editor, event: Event) => void;
  onKeyUp?: (editor: codemirror.Editor, event: Event) => void;
  onUpdate?: (editor: codemirror.Editor, event: Event) => void;
  onBlur?: (editor: codemirror.Editor, event: Event) => void;
  onFocus?: (editor: codemirror.Editor, event: Event) => void;
  onCursorActivity?: (editor: codemirror.Editor) => void;
  onViewportChange?: (editor: codemirror.Editor, start: number, end: number) => void;
  editorDidMount?: (editor: codemirror.Editor, cb: () => void) => void;
  editorWillMount?: () => void;
  editorWillUnmount?: (lib: any) => void;
}

export default class CodeMirror extends React.Component<ICodeMirror, any> {

  /** @internal */
  private ref: HTMLElement;
  /** @internal */
  private editor: any;
  /** @internal */
  private hydrated: boolean;
  /** @internal */
  private continuePreSet: boolean;
  /** @internal */
  private continuePreChange: boolean;
  /** @internal */
  private onBeforeChangeCb: () => void;
  /** @internal */
  private onBeforeSetCb: () => void;
  /** @internal */
  private initCb: () => void;

  /** @internal */
  constructor(props: ICodeMirror) {
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

  /** @internal */
  public componentWillMount() {
    if (this.props.editorWillMount) {
      this.props.editorWillMount();
    }
  }

  /** @internal */
  public componentDidMount() {

    if (this.props.defineMode) {
      if (this.props.defineMode.name && this.props.defineMode.fn) {
        codemirror.defineMode(this.props.defineMode.name, this.props.defineMode.fn);
      }
    }

    this.editor = codemirror(this.ref);

    this.editor.on('beforeChange', (cm, data) => {
      if (this.props.onBeforeChange && this.hydrated) {
        this.props.onBeforeChange(this.editor, data, this.onBeforeChangeCb);
      }
    });

    this.editor.on('change', (cm, data) => {

      if (this.props.onChange && this.hydrated) {

        if (this.props.onBeforeChange) {
          if (this.continuePreChange) {
            this.props.onChange(this.editor, data, this.editor.getValue());
          }
        } else {
          this.props.onChange(this.editor, data, this.editor.getValue());
        }
      }
    });

    if (this.props.onCursorActivity) {
      this.editor.on('cursorActivity', (cm) => {
        this.props.onCursorActivity(this.editor);
      });
    }

    if (this.props.onViewportChange) {
      this.editor.on('viewportChange', (cm, start, end) => {
        this.props.onViewportChange(this.editor, start, end);
      });
    }

    if (this.props.onGutterClick) {
      this.editor.on('gutterClick', (cm, lineNumber, gutter, event) => {
        this.props.onGutterClick(this.editor, lineNumber, gutter, event);
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
      this.editor.on('beforeSelectionChange', (cm, data) => {
        this.props.onSelection(this.editor, data.ranges);
      })
    }

    if (this.props.onScroll) {
      this.editor.on('scroll', (cm) => {

        this.props.onScroll(this.editor, this.editor.getScrollInfo());
      })
    }

    if (this.props.onCursor) {
      this.editor.on('cursorActivity', (cm) => {

        this.props.onCursor(this.editor, this.editor.getCursor());
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

  /** @internal */
  public componentWillReceiveProps(nextProps) {

    let cursorPos: ISetSelectionOptions;

    if (this.props.value !== nextProps.value) {
      this.hydrated = false;
    }

    if (!this.props.resetCursorOnSet) {
      cursorPos = this.editor.getCursor();
    }

    this.hydrate(nextProps);

    if (!this.props.resetCursorOnSet) {

      !this.props.autoScrollCursorOnSet && this.props.autoScrollCursorOnSet !== undefined ?
        this.editor.setCursor(cursorPos, null, {scroll: false}) : this.editor.setCursor(cursorPos);
    }
  }

  /** @internal */
  public componentWillUnmount() {

    if (this.props.editorWillUnmount) {
      this.props.editorWillUnmount(codemirror);
    }
  }

  /** @internal */
  public render() {

    let className = this.props.className ? `react-codemirror2 ${this.props.className}` : 'react-codemirror2';

    return (
      <div className={className} ref={(self) => this.ref = self}/>
    )
  }

  /** @internal */
  private hydrate(props) {

    Object.keys(props.options || {}).forEach(key => this.editor.setOption(key, props.options[key]));

    if (this.props.editorDidConfigure) {
      this.props.editorDidConfigure(this.editor);
    }

    if (!this.hydrated) {

      let lastLine = this.editor.lastLine();
      let lastChar = this.editor.getLine(this.editor.lastLine()).length;

      this.editor.replaceRange(props.value || '',
        {line: 0, ch: 0},
        {line: lastLine, ch: lastChar});

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
}