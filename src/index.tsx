import * as React from 'react';
import * as codemirror from 'codemirror';

declare let global: any;
declare let require: any;

const SERVER_RENDERED = (typeof navigator === 'undefined' || (global && global['PREVENT_CODEMIRROR_RENDER'] === true));

let cm;
if (!SERVER_RENDERED) {
  cm = require('codemirror');
}

export interface IDefineModeOptions {
  fn: () => codemirror.Mode<any>;
  name: string;
}

export interface ISetScrollOptions {
  x?: number | null;
  y?: number | null;
}

export interface ISetSelectionOptions {
  anchor: codemirror.Position;
  head: codemirror.Position;
}

export interface IGetSelectionOptions {
  ranges: Array<ISetSelectionOptions>;
  origin: string;
  update: (ranges: Array<ISetSelectionOptions>) => void;
}

/* <tshacks>: laundry list of incorrect typings in @types/codemirror */
export interface IDoc extends codemirror.Doc {
  setCursor: (pos: codemirror.Position, ch?: number, options?: {}) => void;
  setSelections: (ranges: Array<ISetSelectionOptions>) => void;
}

export interface IInstance extends codemirror.Editor, IDoc {
  options: codemirror.EditorConfiguration
}

/* </tshacks> */

export interface DomEvent {
  (editor: IInstance, event: Event): void;
}

export interface ICodeMirror {
  autoCursor?: boolean; // default: true
  autoScroll?: boolean; // default: false
  className?: string;
  cursor?: codemirror.Position;
  defineMode?: IDefineModeOptions;
  editorDidConfigure?: (editor: IInstance) => void;
  editorDidMount?: (editor: IInstance, value: string, cb: () => void) => void;
  editorWillMount?: () => void;
  editorWillUnmount?: (lib: any) => void;
  onBlur?: DomEvent;
  onChange?: (editor: IInstance, data: codemirror.EditorChange, value: string) => void;
  onContextMenu?: DomEvent;
  onCopy?: DomEvent;
  onCursor?: (editor: IInstance, data: codemirror.Position) => void;
  onCut?: DomEvent;
  onCursorActivity?: (editor: IInstance) => void;
  onDblClick?: DomEvent;
  onDragEnter?: DomEvent;
  onDragLeave?: DomEvent;
  onDragOver?: DomEvent
  onDragStart?: DomEvent;
  onDrop?: DomEvent;
  onFocus?: DomEvent
  onGutterClick?: (editor: IInstance, lineNumber: number, gutter: string, event: Event) => void;
  onKeyDown?: DomEvent;
  onKeyPress?: DomEvent;
  onKeyUp?: DomEvent;
  onMouseDown?: DomEvent;
  onPaste?: DomEvent;
  onRenderLine?: (editor: IInstance, line: codemirror.LineHandle, element: HTMLElement) => void;
  onScroll?: (editor: IInstance, data: codemirror.ScrollInfo) => void;
  onSelection?: (editor: IInstance, data: IGetSelectionOptions) => void;
  onTouchStart?: DomEvent;
  onUpdate?: (editor: IInstance) => void;
  onViewportChange?: (editor: IInstance, start: number, end: number) => void;
  options?: codemirror.EditorConfiguration
  selection?: { ranges: Array<ISetSelectionOptions>, focus?: boolean };
  scroll?: ISetScrollOptions;
}

export interface IControlledCodeMirror extends ICodeMirror {
  onBeforeChange: (editor: IInstance, data: codemirror.EditorChange, value: string) => void;
  value: string;
}

export interface IUnControlledCodeMirror extends ICodeMirror {
  detach?: boolean;
  editorDidAttach?: (editor: IInstance) => void;
  editorDidDetach?: (editor: IInstance) => void;
  onBeforeChange?: (editor: IInstance, data: codemirror.EditorChange, value: string, next: () => void) => void;
  value?: string;
}

declare interface ICommon {
  wire: (props: IControlledCodeMirror | IUnControlledCodeMirror) => void;
  apply: (props: IControlledCodeMirror | IUnControlledCodeMirror) => void;
  applyNext: (props: IControlledCodeMirror | IUnControlledCodeMirror, next?: IControlledCodeMirror | IUnControlledCodeMirror, preserved?: IPreservedOptions) => void;
  applyUserDefined: (props: IControlledCodeMirror | IUnControlledCodeMirror, preserved?: IPreservedOptions) => void;
}

declare interface IPreservedOptions {
  cursor?: codemirror.Position
}

abstract class Helper {
  public static equals(x: {}, y: {}) {
    const ok = Object.keys, tx = typeof x, ty = typeof y;
    return x && y && tx === 'object' && tx === ty ? (
      ok(x).length === ok(y).length &&
      ok(x).every(key => this.equals(x[key], y[key]))
    ) : (x === y);
  }
}

class Shared implements ICommon {

  private editor: IInstance;
  private props: ICodeMirror;

  constructor(editor, props) {
    this.editor = editor;
    this.props = props;
  }

  delegateCursor(position: codemirror.Position, scroll?: boolean, focus?: boolean) {

    let doc = this.editor.getDoc() as IDoc;

    if (focus) {
      this.editor.focus();
    }

    scroll ? doc.setCursor(position) : doc.setCursor(position, null, {scroll: false});
  }

  delegateScroll(coordinates: ISetScrollOptions) {
    this.editor.scrollTo(coordinates.x, coordinates.y)
  }

  delegateSelection(ranges: Array<ISetSelectionOptions>, focus?: boolean) {
    this.editor.setSelections(ranges);

    if (focus) {
      this.editor.focus();
    }
  }

  public apply(props: IControlledCodeMirror | IUnControlledCodeMirror) {

    // init ranges
    if (props && props.selection && props.selection.ranges) {
      this.delegateSelection(props.selection.ranges, props.selection.focus || false);
    }

    // init cursor
    if (props && props.cursor) {
      this.delegateCursor(props.cursor, (props.autoScroll || false), (this.editor.getOption('autofocus') || false));
    }

    // init scroll
    if (props && props.scroll) {
      this.delegateScroll(props.scroll);
    }
  }

  public applyNext(props: IControlledCodeMirror | IUnControlledCodeMirror, next?: IControlledCodeMirror | IUnControlledCodeMirror, preserved?: any) {

    // handle new ranges
    if (props && props.selection && props.selection.ranges) {
      if (next && next.selection && next.selection.ranges && !Helper.equals(props.selection.ranges, next.selection.ranges)) {
        this.delegateSelection(next.selection.ranges, next.selection.focus || false);
      }
    }

    // handle new cursor
    if (props && props.cursor) {
      if (next && next.cursor && !Helper.equals(props.cursor, next.cursor)) {
        this.delegateCursor(preserved.cursor || next.cursor, (next.autoScroll || false), (next.autoCursor || false));
      }
    }

    // handle new scroll
    if (props && props.scroll) {
      if (next && next.scroll && !Helper.equals(props.scroll, next.scroll)) {
        this.delegateScroll(next.scroll)
      }
    }
  }

  public applyUserDefined(props: IControlledCodeMirror | IUnControlledCodeMirror, preserved?: any) {
    if (preserved && preserved.cursor) {
      this.delegateCursor(preserved.cursor, (props.autoScroll || false), (this.editor.getOption('autofocus') || false));
    }
  }

  public wire(props: IControlledCodeMirror | IUnControlledCodeMirror) {

    Object.keys(props || {}).filter(p => /^on/.test(p)).forEach(prop => {
      switch (prop) {
        case 'onBlur': {
          (this.editor as any).on('blur', (cm, event) => {
            this.props.onBlur(this.editor, event);
          });
        }
          break;
        case 'onContextMenu': {
          this.editor.on('contextmenu', (cm, event) => {
            this.props.onContextMenu(this.editor, event);
          });
          break;
        }
        case 'onCopy': {
          this.editor.on('copy', (cm, event) => {
            this.props.onCopy(this.editor, event);
          });
          break;
        }
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
        case 'onCut': {
          this.editor.on('cut', (cm, event) => {
            this.props.onCut(this.editor, event);
          });
          break;
        }
        case 'onDblClick': {
          this.editor.on('dblclick', (cm, event) => {
            this.props.onDblClick(this.editor, event);
          });
          break;
        }
        case 'onDragEnter': {
          this.editor.on('dragenter', (cm, event) => {
            this.props.onDragEnter(this.editor, event);
          });
        }
          break;
        case 'onDragLeave': {
          this.editor.on('dragleave', (cm, event) => {
            this.props.onDragLeave(this.editor, event);
          });
          break;
        }
        case 'onDragOver': {
          this.editor.on('dragover', (cm, event) => {
            this.props.onDragOver(this.editor, event);
          });
        }
          break;
        case 'onDragStart': {
          this.editor.on('dragstart', (cm, event) => {
            this.props.onDragStart(this.editor, event);
          });
          break;
        }
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
        case 'onMouseDown': {
          this.editor.on('mousedown', (cm, event) => {
            this.props.onMouseDown(this.editor, event);
          });
          break;
        }
        case 'onPaste': {
          this.editor.on('paste', (cm, event) => {
            this.props.onPaste(this.editor, event);
          });
          break;
        }
        case 'onRenderLine': {
          this.editor.on('renderLine', (cm, line, element) => {
            this.props.onRenderLine(this.editor, line, element);
          });
          break;
        }
        case 'onScroll': {
          this.editor.on('scroll', (cm) => {
            this.props.onScroll(this.editor, this.editor.getScrollInfo());
          });
        }
          break;
        case 'onSelection': {
          this.editor.on('beforeSelectionChange', (cm, data: any) => {
            this.props.onSelection(this.editor, data);
          });
        }
          break;
        case 'onTouchStart': {
          this.editor.on('touchstart', (cm, event) => {
            this.props.onTouchStart(this.editor, event);
          });
          break;
        }
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
      }
    });
  }
}

export class Controlled extends React.Component<IControlledCodeMirror, any> {

  /** @internal */
  private applied: boolean;
  /** @internal */
  private appliedNext: boolean;
  /** @internal */
  private appliedUserDefined: boolean;
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

    if (SERVER_RENDERED) return;

    this.applied = false;
    this.appliedNext = false;
    this.appliedUserDefined = false;
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
  private hydrate(props) {

    let userDefinedOptions = Object.assign({}, cm.defaults, this.editor.options, props.options || {});
    let optionDelta = Object.keys(userDefinedOptions).some(key => this.editor.getOption(key) !== userDefinedOptions[key]);

    if (optionDelta) {
      Object.keys(userDefinedOptions).forEach(key => {
        if (props.options.hasOwnProperty(key)) {
          if (this.editor.getOption(key) !== userDefinedOptions[key]) {
            this.editor.setOption(key, userDefinedOptions[key]);
            this.mirror.setOption(key, userDefinedOptions[key]);
          }
        }
      });
    }

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

    this.emulating = true;

    if (this.deferred.origin === 'undo') {
      this.editor.undo();
    } else if (this.deferred.origin === 'redo') {
      this.editor.redo();
    } else {
      this.editor.replaceRange(this.deferred.text, this.deferred.from, this.deferred.to, this.deferred.origin);
    }

    this.emulating = false;
    this.deferred = null;
  }

  /** @internal */
  private mirrorChange(deferred) {

    if (deferred.origin === 'undo') {
      this.editor.setHistory(this.mirror.getHistory());
      this.mirror.undo();
    } else if (deferred.origin === 'redo') {
      this.editor.setHistory(this.mirror.getHistory());
      this.mirror.redo();
    } else {
      this.mirror.replaceRange(deferred.text, deferred.from, deferred.to, deferred.origin);
    }

    return this.mirror.getValue();
  }

  /** @internal */
  public componentWillMount() {

    if (SERVER_RENDERED) return;

    if (this.props.editorWillMount) {
      this.props.editorWillMount();
    }
  }

  /** @internal */
  public componentDidMount() {

    if (SERVER_RENDERED) return;

    if (this.props.defineMode) {
      if (this.props.defineMode.name && this.props.defineMode.fn) {
        cm.defineMode(this.props.defineMode.name, this.props.defineMode.fn);
      }
    }

    this.editor = cm(this.ref) as IInstance;

    this.shared = new Shared(this.editor, this.props);

    this.mirror = (cm as any)(() => {
    });

    this.editor.on('electricInput', () => {
      this.mirror.setHistory(this.editor.getHistory());
    });

    this.editor.on('cursorActivity', () => {
      this.mirror.setCursor(this.editor.getCursor());
    });

    this.editor.on('beforeChange', (cm, data) => {

      if (this.emulating) {
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

    this.hydrate(this.props);

    this.shared.apply(this.props);

    this.applied = true;

    this.mounted = true;

    this.shared.wire(this.props);

    if (this.editor.getOption('autofocus')) {
      this.editor.focus();
    }

    if (this.props.editorDidMount) {
      this.props.editorDidMount(this.editor, this.editor.getValue(), this.initCb);
    }
  }

  /** @internal */
  public componentWillReceiveProps(nextProps) {

    if (SERVER_RENDERED) return;

    let preserved: IPreservedOptions = {cursor: null};

    if (nextProps.value !== this.props.value) {
      this.hydrated = false;
    }

    if (!this.props.autoCursor && this.props.autoCursor !== undefined) {
      preserved.cursor = this.editor.getCursor();
    }

    this.hydrate(nextProps);

    if (!this.appliedNext) {
      this.shared.applyNext(this.props, nextProps, preserved);
      this.appliedNext = true;
    }

    this.shared.applyUserDefined(this.props, preserved);
    this.appliedUserDefined = true;
  }

  /** @internal */
  public componentWillUnmount() {

    if (SERVER_RENDERED) return;

    if (this.props.editorWillUnmount) {
      this.props.editorWillUnmount(cm);
    }
  }

  /** @internal */
  public shouldComponentUpdate(nextProps, nextState) {
    return !SERVER_RENDERED
  }

  /** @internal */
  public render() {

    if (SERVER_RENDERED) return null;

    let className = this.props.className ? `react-codemirror2 ${this.props.className}` : 'react-codemirror2';

    return <div className={className} ref={self => this.ref = self}/>
  }
}

export class UnControlled extends React.Component<IUnControlledCodeMirror, any> {

  /** @internal */
  private applied: boolean;
  /** @internal */
  private appliedUserDefined: boolean;
  /** @internal */
  private continueChange: boolean;
  /** @internal */
  private detached: boolean;
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

    if (SERVER_RENDERED) return;

    this.applied = false;
    this.appliedUserDefined = false;
    this.continueChange = false;
    this.detached = false;
    this.hydrated = false;
    this.initCb = () => {
      if (this.props.editorDidConfigure) {
        this.props.editorDidConfigure(this.editor);
      }
    };
    this.mounted = false;
    this.onBeforeChangeCb = () => {
      this.continueChange = true;
    };
  }

  /** @internal */
  private hydrate(props) {

    let userDefinedOptions = Object.assign({}, cm.defaults, this.editor.options, props.options || {});
    let optionDelta = Object.keys(userDefinedOptions).some(key => this.editor.getOption(key) !== userDefinedOptions[key]);

    if (optionDelta) {
      Object.keys(userDefinedOptions).forEach(key => {
        if (props.options.hasOwnProperty(key)) {
          if (this.editor.getOption(key) !== userDefinedOptions[key]) {
            this.editor.setOption(key, userDefinedOptions[key]);
          }
        }
      });
    }

    if (!this.hydrated) {
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

    if (SERVER_RENDERED) return;

    if (this.props.editorWillMount) {
      this.props.editorWillMount();
    }
  }

  /** @internal */
  public componentDidMount() {

    if (SERVER_RENDERED) return;

    this.detached = (this.props.detach === true);

    if (this.props.defineMode) {
      if (this.props.defineMode.name && this.props.defineMode.fn) {
        cm.defineMode(this.props.defineMode.name, this.props.defineMode.fn);
      }
    }

    this.editor = cm(this.ref) as IInstance;

    this.shared = new Shared(this.editor, this.props);

    this.editor.on('beforeChange', (cm, data) => {

      if (this.props.onBeforeChange) {
        this.props.onBeforeChange(this.editor, data, this.editor.getValue(), this.onBeforeChangeCb)
      }
    });

    this.editor.on('change', (cm, data) => {

      if (!this.mounted || !this.props.onChange) {
        return;
      }

      if (this.props.onBeforeChange) {
        if (this.continueChange) {
          this.props.onChange(this.editor, data, this.editor.getValue())
        }
      } else {
        this.props.onChange(this.editor, data, this.editor.getValue())
      }
    });

    this.hydrate(this.props);

    this.shared.apply(this.props);

    this.applied = true;

    this.mounted = true;

    this.shared.wire(this.props);

    this.editor.clearHistory();

    if (this.props.editorDidMount) {
      this.props.editorDidMount(this.editor, this.editor.getValue(), this.initCb);
    }
  }

  /** @internal */
  public componentWillReceiveProps(nextProps) {

    if (this.detached && (nextProps.detach === false)) {
      this.detached = false;
      if (this.props.editorDidAttach) {
        this.props.editorDidAttach(this.editor);
      }
    }

    if (!this.detached && (nextProps.detach === true)) {
      this.detached = true;
      if (this.props.editorDidDetach) {
        this.props.editorDidDetach(this.editor);
      }
    }

    if (SERVER_RENDERED || this.detached) return;

    let preserved: IPreservedOptions = {cursor: null};

    if (nextProps.value !== this.props.value) {
      this.hydrated = false;
      this.applied = false;
      this.appliedUserDefined = false;
    }

    if (!this.props.autoCursor && this.props.autoCursor !== undefined) {
      preserved.cursor = this.editor.getCursor();
    }

    this.hydrate(nextProps);

    if (!this.applied) {
      this.shared.apply(this.props);
      this.applied = true;
    }

    if (!this.appliedUserDefined) {
      this.shared.applyUserDefined(this.props, preserved);
      this.appliedUserDefined = true;
    }
  }

  /** @internal */
  public componentWillUnmount() {

    if (SERVER_RENDERED) return;

    if (this.props.editorWillUnmount) {
      this.props.editorWillUnmount(cm);
    }
  }

  /** @internal */
  public shouldComponentUpdate(nextProps, nextState) {

    let update = true;

    if (SERVER_RENDERED) update = false;
    if (this.detached) update = false;

    return update;
  }

  /** @internal */
  public render() {

    if (SERVER_RENDERED) return null;

    let className = this.props.className ? `react-codemirror2 ${this.props.className}` : 'react-codemirror2';

    return <div className={className} ref={self => this.ref = self}/>
  }
}
