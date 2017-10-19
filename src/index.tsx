import * as React from 'react';
import * as codemirror from 'codemirror';

let cm;

const IS_MOBILE = typeof navigator === 'undefined' || (
    navigator.userAgent.match(/Android/i)
    || navigator.userAgent.match(/webOS/i)
    || navigator.userAgent.match(/iPhone/i)
    || navigator.userAgent.match(/iPad/i)
    || navigator.userAgent.match(/iPod/i)
    || navigator.userAgent.match(/BlackBerry/i)
    || navigator.userAgent.match(/Windows Phone/i)
  );

declare let require: any;

if (!IS_MOBILE) {
  cm = require('codemirror');
}

export interface IDefineModeOptions {
  fn: () => codemirror.Mode<any>;
  name: string;
}

export interface ISetScrollOptions {
  x: number;
  y: number;
}

export interface ISetSelectionOptions {
  anchor: codemirror.Position,
  head: codemirror.Position
}

export interface IDoc extends codemirror.Doc {
  /* tshack: `setCursor` has incorrect/missing overloaded signature in @types/codemirror */
  setCursor: (pos: codemirror.Position, ch?: number, options?: {}) => void;
  /* tshack: `setSelections` missing in @types/codemirror */
  setSelections: (ranges: Array<ISetSelectionOptions>) => void;
}

export interface IInstance extends codemirror.Editor, IDoc {
}

export interface ICodeMirror {

  autoCursor?: boolean; // default: true
  autoFocus?: boolean; // default: false
  autoScroll?: boolean; // default: false
  className?: string;
  cursor?: codemirror.Position;
  defineMode?: IDefineModeOptions;
  editorDidConfigure?: (editor: IInstance) => void;
  editorDidMount?: (editor: IInstance, value: string, cb: () => void) => void;
  editorWillMount?: () => void;
  editorWillUnmount?: (lib: any) => void;
  onBlur?: (editor: IInstance, event: Event) => void;
  onChange?: (editor: IInstance, data: codemirror.EditorChange, value: string) => void;
  onCursor?: (editor: IInstance, data: codemirror.Position) => void;
  onCursorActivity?: (editor: IInstance) => void;
  onDragEnter?: (editor: IInstance, event: Event) => void;
  onDragOver?: (editor: IInstance, event: Event) => void;
  onDrop?: (editor: IInstance, event: Event) => void;
  onFocus?: (editor: IInstance, event: Event) => void;
  onGutterClick?: (editor: IInstance, lineNumber: number, gutter: string, event: Event) => void;
  onKeyDown?: (editor: IInstance, event: Event) => void;
  onKeyPress?: (editor: IInstance, event: Event) => void;
  onKeyUp?: (editor: IInstance, event: Event) => void;
  onScroll?: (editor: IInstance, data: codemirror.ScrollInfo) => void;
  onSelection?: (editor: IInstance, ranges: ISetSelectionOptions) => void;
  onUpdate?: (editor: IInstance) => void;
  onViewportChange?: (editor: IInstance, start: number, end: number) => void;
  options?: codemirror.EditorConfiguration
  selection?: Array<ISetSelectionOptions>;
  scroll?: ISetScrollOptions;
  /* <deprecated> */
  autoScrollCursorOnSet?: any;
  onBeforeSet?: any;
  onSet?: any;
  resetCursorOnSet?: any;
  /* </deprecated> */
}

export interface IControlledCodeMirror extends ICodeMirror {
  onBeforeChange: (editor: IInstance, data: codemirror.EditorChange, value: string) => void;
  value: string;
}

export interface IUnControlledCodeMirror extends ICodeMirror {
  onBeforeChange?: (editor: IInstance, data: codemirror.EditorChange, value: string, next: () => void) => void;
  value?: string;
}

declare interface ICommon {
  wire: (name: string) => void;
  notifyOfDeprecation: () => void;
}

class Shared implements ICommon {

  private editor: IInstance;
  private props: ICodeMirror;

  constructor(editor, props) {

    this.editor = editor;
    this.props = props;

    this.notifyOfDeprecation();
  }

  public notifyOfDeprecation() {
    if (this.props.autoScrollCursorOnSet !== undefined) {
      console.warn('`autoScrollCursorOnSet` has been deprecated. Use `autoScroll` instead\n\nSee https://github.com/scniro/react-codemirror2#props');
    }

    if (this.props.resetCursorOnSet !== undefined) {
      console.warn('`resetCursorOnSet` has been deprecated. Use `autoCursor` instead\n\nSee https://github.com/scniro/react-codemirror2#props');
    }

    if (this.props.onSet !== undefined) {
      console.warn('`onSet` has been deprecated. User `editorDidMount` instead. See https://github.com/scniro/react-codemirror2#events');
    }

    if (this.props.onBeforeSet !== undefined) {
      console.warn('`onBeforeSet` has been deprecated. User `onBeforeChange` for `Controlled`. instead. See https://github.com/scniro/react-codemirror2#events');
    }
  }

  public wire(name: string) {

    switch (name) {
      case 'onBlur': {
        (this.editor as any).on('blur', (cm, event) => {
          this.props.onBlur(this.editor, event);
        });
      }
        break;
      case 'onCursor': {
        this.editor.on('cursorActivity', (cm) => {
          this.props.onCursor(this.editor, this.editor.getCursor());
        });
      }
        break;
      case 'onCursorActivity': {
        this.editor.on('cursorActivity', (cm) => {
          this.props.onCursorActivity(this.editor);
        });
      }
        break;
      case 'onDragEnter': {
        this.editor.on('dragenter', (cm, event) => {
          this.props.onDragEnter(this.editor, event);
        });
      }
        break;
      case 'onDragOver': {
        this.editor.on('dragover', (cm, event) => {
          this.props.onDragOver(this.editor, event);
        });
      }
        break;
      case 'onDrop': {
        this.editor.on('drop', (cm, event) => {
          this.props.onDrop(this.editor, event);
        });
      }
        break;
      case 'onFocus': {
        (this.editor as any).on('focus', (cm, event) => {
          this.props.onFocus(this.editor, event);
        });
      }
        break;
      case 'onGutterClick': {
        this.editor.on('gutterClick', (cm, lineNumber, gutter, event) => {
          this.props.onGutterClick(this.editor, lineNumber, gutter, event);
        });
      }
        break;
      case 'onKeyDown': {
        this.editor.on('keydown', (cm, event) => {
          this.props.onKeyDown(this.editor, event);
        });
      }
        break;
      case 'onKeyPress': {
        this.editor.on('keypress', (cm, event) => {
          this.props.onKeyPress(this.editor, event);
        });
      }
        break;
      case 'onKeyUp': {
        this.editor.on('keyup', (cm, event) => {
          this.props.onKeyUp(this.editor, event);
        });
      }
        break;
      case 'onScroll': {
        this.editor.on('scroll', (cm) => {
          this.props.onScroll(this.editor, this.editor.getScrollInfo());
        });
      }
        break;
      case 'onSelection': {
        this.editor.on('beforeSelectionChange', (cm, data) => {
          this.props.onSelection(this.editor, data);
        });
      }
        break;
      case 'onUpdate': {
        this.editor.on('update', (cm) => {
          this.props.onUpdate(this.editor);
        });
      }
        break;
      case 'onViewportChange': {
        this.editor.on('viewportChange', (cm, from, to) => {
          this.props.onViewportChange(this.editor, from, to);
        });
      }
        break;
      default: {
        break;
      }
    }
  }
}

export class Controlled extends React.Component<IControlledCodeMirror, any> {

  /** @internal */
  private deferred: any;
  /** @internal */
  private editor: IInstance;
  /** @internal */
  private emulating: boolean;
  /** @internal */
  private hydrated: boolean;
  /** @internal */
  private initCb: () => void;
  /** @internal */
  private mirror: any;
  /** @internal */
  private mounted: boolean;
  /** @internal */
  private ref: HTMLElement;
  /** @internal */
  private shared: Shared;

  /** @internal */
  constructor(props: IControlledCodeMirror) {
    super(props);

    this.deferred = null;
    this.emulating = false;
    this.hydrated = false;
    this.initCb = () => {
      if (this.props.editorDidConfigure) {
        this.props.editorDidConfigure(this.editor);
      }
    };
    this.mounted = false;
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
  private hydrate(props) {

    Object.keys(props.options || {}).forEach(key => this.editor.setOption(key, props.options[key]));

    if (!this.hydrated) {

      if (!this.mounted) {
        this.initChange(props.value || '');
      } else {
        if (this.deferred) {
          this.resolveChange();
        } else {
          this.initChange(props.value || '');
        }
      }
    }

    this.hydrated = true;
  }

  /** @internal */
  private initChange(value) {

    this.emulating = true;

    let lastLine = this.editor.lastLine();
    let lastChar = this.editor.getLine(this.editor.lastLine()).length;

    this.editor.replaceRange(value || '',
      {line: 0, ch: 0},
      {line: lastLine, ch: lastChar});

    this.mirror.setValue(value);
    this.editor.clearHistory();
    this.mirror.clearHistory();

    this.emulating = false;
  }

  /** @internal */
  private resolveChange() {

    this.editor.operation(() => {
      this.emulating = true;
      this.editor.replaceRange(this.deferred.text.join('\n'), this.deferred.from, this.deferred.to, this.deferred.origin);
      this.emulating = false;
      this.deferred = null;
    });
  }

  /** @internal */
  private mirrorChange(deferred) {

    this.mirror.replaceRange(deferred.text, deferred.from, deferred.to, deferred.origin);

    return this.mirror.getValue();
  }

  /** @internal */
  public componentWillMount() {

    if (this.props.editorWillMount) {
      this.props.editorWillMount();
    }
  }

  /** @internal */
  public componentDidMount() {

    if (!IS_MOBILE) {

      if (this.props.defineMode) {
        if (this.props.defineMode.name && this.props.defineMode.fn) {
          cm.defineMode(this.props.defineMode.name, this.props.defineMode.fn);
        }
      }

      this.editor = cm(this.ref) as IInstance;

      this.shared = new Shared(this.editor, this.props);

      this.mirror = (cm as any)(() => {
      });

      this.editor.on('beforeChange', (cm, data) => {

        if (this.emulating) {
          return;
        }

        if (data.origin === 'undo') {
          return;
        }

        if (data.origin === 'redo') {
          return;
        }

        data.cancel();

        this.deferred = data;

        let phantomChange = this.mirrorChange(this.deferred);

        if (this.props.onBeforeChange)
          this.props.onBeforeChange(this.editor, this.deferred, phantomChange);
      });

      this.editor.on('change', (cm, data) => {

        if (!this.mounted) {
          return;
        }

        if (this.props.onChange) {
          this.props.onChange(this.editor, data, this.editor.getValue());
        }
      });

      if (this.props.onBlur) this.shared.wire('onBlur');
      if (this.props.onCursor) this.shared.wire('onCursor');
      if (this.props.onCursorActivity) this.shared.wire('onCursorActivity');
      if (this.props.onDragEnter) this.shared.wire('onDragEnter');
      if (this.props.onDragOver) this.shared.wire('onDragOver');
      if (this.props.onDrop) this.shared.wire('onDrop');
      if (this.props.onFocus) this.shared.wire('onFocus');
      if (this.props.onGutterClick) this.shared.wire('onGutterClick');
      if (this.props.onKeyDown) this.shared.wire('onKeyDown');
      if (this.props.onKeyPress) this.shared.wire('onKeyPress');
      if (this.props.onKeyUp) this.shared.wire('onKeyUp');
      if (this.props.onScroll) this.shared.wire('onScroll');
      if (this.props.onSelection) this.shared.wire('onSelection');
      if (this.props.onUpdate) this.shared.wire('onUpdate');
      if (this.props.onViewportChange) this.shared.wire('onViewportChange');

      this.hydrate(this.props);

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

      this.mounted = true;

      if (this.props.editorDidMount) {
        this.props.editorDidMount(this.editor, this.editor.getValue(), this.initCb);
      }
    }
  }

  /** @internal */
  public componentWillReceiveProps(nextProps) {

    let cursorPos: codemirror.Position;

    if (nextProps.value !== this.props.value) {
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
      this.props.editorWillUnmount(cm);
    }
  }

  /** @internal */
  public render() {

    let className = this.props.className ? `react-codemirror2 ${this.props.className}` : 'react-codemirror2';

    return (
      <div className={className} ref={(self) => this.ref = self}/>
    )
  }
}

export class UnControlled extends React.Component<IUnControlledCodeMirror, any> {

  /** @internal */
  private continueChange: boolean;
  /** @internal */
  private editor: IInstance;
  /** @internal */
  private hydrated: boolean;
  /** @internal */
  private initCb: () => void;
  /** @internal */
  private mounted: boolean;
  /** @internal */
  private onBeforeChangeCb: () => void;
  /** @internal */
  private ref: HTMLElement;
  /** @internal */
  private shared: Shared;

  /** @internal */
  constructor(props: IUnControlledCodeMirror) {
    super(props);

    this.continueChange = false;
    this.hydrated = false;
    this.initCb = () => {
      if (this.props.editorDidConfigure) {
        this.props.editorDidConfigure(this.editor);
      }
    }
    this.mounted = false;
    this.onBeforeChangeCb = () => {
      this.continueChange = true;
    };
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
  private hydrate(props) {

    Object.keys(props.options || {}).forEach(key => this.editor.setOption(key, props.options[key]));

    if (!this.hydrated) {
      // this.editor.setValue(props.value || '');
      let lastLine = this.editor.lastLine();
      let lastChar = this.editor.getLine(this.editor.lastLine()).length;

      this.editor.replaceRange(props.value || '',
        {line: 0, ch: 0},
        {line: lastLine, ch: lastChar});
    }

    this.hydrated = true;
  }

  /** @internal */
  public componentWillMount() {

    if (this.props.editorWillMount) {
      this.props.editorWillMount();
    }
  }

  /** @internal */
  public componentDidMount() {

    if (!IS_MOBILE) {

      if (this.props.defineMode) {
        if (this.props.defineMode.name && this.props.defineMode.fn) {
          cm.defineMode(this.props.defineMode.name, this.props.defineMode.fn);
        }
      }

      this.editor = cm(this.ref) as IInstance;

      this.shared = new Shared(this.editor, this.props);

      this.editor.on('beforeChange', (cm, data) => {

        if (this.props.onBeforeChange) {
          this.props.onBeforeChange(this.editor, data, null, this.onBeforeChangeCb)
        }
      });

      this.editor.on('change', (cm, data) => {

        if (!this.mounted) {
          return;
        }

        if (this.props.onBeforeChange) {
          if (this.continueChange) {
            this.props.onChange(this.editor, data, this.editor.getValue())
          } else {
            return;
          }
        } else {
          this.props.onChange(this.editor, data, this.editor.getValue())
        }
      });

      if (this.props.onBlur) this.shared.wire('onBlur');
      if (this.props.onCursor) this.shared.wire('onCursor');
      if (this.props.onCursorActivity) this.shared.wire('onCursorActivity');
      if (this.props.onDragEnter) this.shared.wire('onDragEnter');
      if (this.props.onDragOver) this.shared.wire('onDragOver');
      if (this.props.onDrop) this.shared.wire('onDrop');
      if (this.props.onFocus) this.shared.wire('onFocus');
      if (this.props.onGutterClick) this.shared.wire('onGutterClick');
      if (this.props.onKeyDown) this.shared.wire('onKeyDown');
      if (this.props.onKeyPress) this.shared.wire('onKeyPress');
      if (this.props.onKeyUp) this.shared.wire('onKeyUp');
      if (this.props.onScroll) this.shared.wire('onScroll');
      if (this.props.onSelection) this.shared.wire('onSelection');
      if (this.props.onUpdate) this.shared.wire('onUpdate');
      if (this.props.onViewportChange) this.shared.wire('onViewportChange');

      this.hydrate(this.props);

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

      this.mounted = true;

      if (this.props.editorDidMount) {
        this.props.editorDidMount(this.editor, this.editor.getValue(), this.initCb);
      }
    }
  }

  /** @internal */
  public componentWillReceiveProps(nextProps) {

    let cursorPos: codemirror.Position;

    if (nextProps.value !== this.props.value) {
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
      this.props.editorWillUnmount(cm);
    }
  }

  /** @internal */
  public render() {

    let className = this.props.className ? `react-codemirror2 ${this.props.className}` : 'react-codemirror2';

    return (
      <div className={className} ref={(self) => this.ref = self}/>
    )
  }
}
