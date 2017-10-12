import * as React from 'react';
import * as codemirror from 'codemirror';

export interface IDefineModeOptions {
  name: string;
  fn: () => codemirror.Mode<any>;
}

export interface ISetScrollOptions {
  x: number;
  y: number;
}

export interface ISetSelectionOptions {
  anchor: codemirror.Position,
  head: codemirror.Position
}

// tshack: `setSelections` missing in @types/codemirror
export interface IDoc extends codemirror.Doc {
  setSelections: (ranges: Array<ISetSelectionOptions>) => void;
  setCursor: (pos: codemirror.Position, ch?: number, options?: {}) => void;
}

export interface IInstance extends codemirror.Editor, IDoc {
}

export interface ICodeMirror {
  value?: string;
  options?: codemirror.EditorConfiguration
  className?: string;
  defineMode?: IDefineModeOptions;
  editorDidConfigure?: (editor: IInstance) => void;
  cursor?: codemirror.Position;
  onSet?: (editor: IInstance, value: string) => void;
  onBeforeSet?: (editor: IInstance, cb: () => void) => void;
  autoScroll?: boolean, // default: false
  autoFocus?: boolean, // default: false
  autoCursor?: boolean, // default: true
  scroll?: ISetScrollOptions;
  selection?: Array<ISetSelectionOptions>;
  onGutterClick?: (editor: IInstance, lineNumber: number, gutter: string, event: Event) => void;
  onBeforeChange?: (editor: IInstance, data: codemirror.EditorChange, cb: () => void) => void;
  onChange?: (editor: IInstance, data: codemirror.EditorChange, value: string) => void;
  onCursor?: (editor: IInstance, data: codemirror.Position) => void;
  onScroll?: (editor: IInstance, data: codemirror.ScrollInfo) => void;
  onDrop?: (editor: IInstance, event: Event) => void;
  onDragOver?: (editor: IInstance, event: Event) => void;
  onDragEnter?: (editor: IInstance, event: Event) => void;
  onSelection?: (editor: IInstance, ranges: ISetSelectionOptions) => void;
  onKeyPress?: (editor: IInstance, event: Event) => void;
  onKeyDown?: (editor: IInstance, event: Event) => void;
  onKeyUp?: (editor: IInstance, event: Event) => void;
  onUpdate?: (editor: IInstance) => void;
  onBlur?: (editor: IInstance, event: Event) => void;
  onFocus?: (editor: IInstance, event: Event) => void;
  onCursorActivity?: (editor: IInstance) => void;
  onViewportChange?: (editor: IInstance, start: number, end: number) => void;
  editorDidMount?: (editor: IInstance, cb: () => void) => void;
  editorWillMount?: () => void;
  editorWillUnmount?: (lib: any) => void;
  //deprecated: temporary
  autoScrollCursorOnSet?: boolean;
  //deprecated: temporary
  resetCursorOnSet?: boolean;
}

export default class CodeMirror extends React.Component<ICodeMirror, any> {

  /** @internal */
  private ref: HTMLElement;
  /** @internal */
  private editor: IInstance;
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

    if (this.props.autoScrollCursorOnSet !== undefined || this.props.resetCursorOnSet !== undefined) {
      this.notifyOfDeprecation();
    }

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
  private setCursor(cursorPos: codemirror.Position, scroll: boolean, focus?: boolean) {

    let doc = this.editor.getDoc() as IDoc;

    if (focus) {
      this.editor.focus();
    }

    if (scroll) {
      doc.setCursor(cursorPos);
    } else {
      doc.setCursor(cursorPos, null, {scroll: false});
    }
  }

  /** @internal */
  private moveCursor(cursorPos: codemirror.Position, scroll: boolean) {

    let doc = this.editor.getDoc() as IDoc;

    if (scroll) {
      doc.setCursor(cursorPos);
    } else {
      doc.setCursor(cursorPos, null, {scroll: false});
    }
  }

  /** @internal */
  private notifyOfDeprecation() {

    if (this.props.autoScrollCursorOnSet !== undefined) {
      console.warn('`autoScrollCursorOnSet` has been deprecated. Use `autoScroll` instead\n\nSee https://github.com/scniro/react-codemirror2#props')
    }

    if (this.props.resetCursorOnSet !== undefined) {
      console.warn('`resetCursorOnSet` has been deprecated. Use `autoCursor` instead\n\nSee https://github.com/scniro/react-codemirror2#props')
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

    this.editor = codemirror(this.ref) as IInstance;
    (window as any).editor = this.editor;

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
      // tshack: missing `focus` DOM event in @types/codemirror
      (this.editor as any).on('focus', (cm, event) => {
        this.props.onFocus(this.editor, event);
      });
    }

    if (this.props.onBlur) {
      // tshack: missing `blur` DOM event in @types/codemirror
      (this.editor as any).on('blur', (cm, event) => {
        this.props.onBlur(this.editor, event);
      });
    }

    if (this.props.onUpdate) {
      this.editor.on('update', (cm) => {
        this.props.onUpdate(this.editor);
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
        this.props.onSelection(this.editor, data);
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
      let doc = this.editor.getDoc() as IDoc;
      doc.setSelections(this.props.selection);
    }

    if (this.props.cursor) {

      this.setCursor(this.props.cursor, this.props.autoScroll || false, this.props.autoFocus || false);
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

    let cursorPos: codemirror.Position;

    if (this.props.value !== nextProps.value) {
      this.hydrated = false;
    }

    if (!this.props.autoCursor && this.props.autoCursor !== undefined) {
      cursorPos = this.editor.getCursor();
    }

    this.hydrate(nextProps);

    if (!this.props.autoCursor && this.props.autoCursor !== undefined) {
      this.moveCursor(cursorPos, this.props.autoScroll || false);
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