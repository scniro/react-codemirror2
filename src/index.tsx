import * as React from "react";
import * as codemirror from "codemirror";
import { Position } from "codemirror";

declare let global: any;
declare let require: any;

const SERVER_RENDERED =
  typeof navigator === "undefined" ||
  global["PREVENT_CODEMIRROR_RENDER"] === true;

let cm;
if (!SERVER_RENDERED) {
  cm = require("codemirror");
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

export interface DomEvent {
  (editor: codemirror.Editor, event: Event): void;
}

export interface ICodeMirror {
  autoCursor?: boolean; // default: true
  autoScroll?: boolean; // default: false
  className?: string;
  cursor?: codemirror.Position;
  defineMode?: IDefineModeOptions;
  editorDidConfigure?: (editor: codemirror.Editor) => void;
  editorDidMount?: (
    editor: codemirror.Editor,
    value: string,
    cb: () => void
  ) => void;
  editorWillUnmount?: (lib: any) => void;
  onBlur?: DomEvent;
  onChange?: (
    editor: codemirror.Editor,
    data: codemirror.EditorChange,
    value: string
  ) => void;
  onContextMenu?: DomEvent;
  onCopy?: DomEvent;
  onCursor?: (editor: codemirror.Editor, data: codemirror.Position) => void;
  onCut?: DomEvent;
  onCursorActivity?: (editor: codemirror.Editor) => void;
  onDblClick?: DomEvent;
  onDragEnter?: DomEvent;
  onDragLeave?: DomEvent;
  onDragOver?: DomEvent;
  onDragStart?: DomEvent;
  onDrop?: DomEvent;
  onFocus?: DomEvent;
  onGutterClick?: (
    editor: codemirror.Editor,
    lineNumber: number,
    gutter: string,
    event: Event
  ) => void;
  onKeyDown?: DomEvent;
  onKeyPress?: DomEvent;
  onKeyUp?: DomEvent;
  onMouseDown?: DomEvent;
  onPaste?: DomEvent;
  onRenderLine?: (
    editor: codemirror.Editor,
    line: codemirror.LineHandle,
    element: HTMLElement
  ) => void;
  onScroll?: (editor: codemirror.Editor, data: codemirror.ScrollInfo) => void;
  onSelection?: (editor: codemirror.Editor, data: any) => void;
  onTouchStart?: DomEvent;
  onUpdate?: (editor: codemirror.Editor) => void;
  onViewportChange?: (
    editor: codemirror.Editor,
    start: number,
    end: number
  ) => void;
  options?: codemirror.EditorConfiguration;
  selection?: { ranges: Array<ISetSelectionOptions>; focus?: boolean };
  scroll?: ISetScrollOptions;
}

export interface IControlledCodeMirror extends ICodeMirror {
  onBeforeChange: (
    editor: codemirror.Editor,
    data: codemirror.EditorChange,
    value: string
  ) => void;
  value: string;
}

export interface IUnControlledCodeMirror extends ICodeMirror {
  detach?: boolean;
  editorDidAttach?: (editor: codemirror.Editor) => void;
  editorDidDetach?: (editor: codemirror.Editor) => void;
  onBeforeChange?: (
    editor: codemirror.Editor,
    data: codemirror.EditorChange,
    value: string,
    next: () => void
  ) => void;
  value?: string;
}

declare interface ICommon {
  wire: (
    prevProps: IControlledCodeMirror | IUnControlledCodeMirror,
    props: IControlledCodeMirror | IUnControlledCodeMirror
  ) => void;
  unwire: (props: IControlledCodeMirror | IUnControlledCodeMirror) => void;
  apply: (props: IControlledCodeMirror | IUnControlledCodeMirror) => void;
  applyNext: (
    props: IControlledCodeMirror | IUnControlledCodeMirror,
    next?: IControlledCodeMirror | IUnControlledCodeMirror,
    preserved?: IPreservedOptions
  ) => void;
  applyUserDefined: (
    props: IControlledCodeMirror | IUnControlledCodeMirror,
    preserved?: IPreservedOptions
  ) => void;
}

declare interface IPreservedOptions {
  cursor?: codemirror.Position;
}

abstract class Helper {
  public static equals(x: {}, y: {}) {
    const ok = Object.keys,
      tx = typeof x,
      ty = typeof y;
    return x && y && tx === "object" && tx === ty
      ? ok(x).length === ok(y).length &&
          ok(x).every(key => this.equals(x[key], y[key]))
      : x === y;
  }
}

class Shared implements ICommon {
  private editor: codemirror.Editor;
  private eventMappings = {
    onBlur: "blur",
    onContextMenu: "contextmenu",
    onCopy: "copy",
    onCursor: "cursorActivity",
    onCursorActivity: "cursorActivity",
    onCut: "cut",
    onDblClick: "dblclick",
    onDragEnter: "dragenter",
    onDragLeave: "dragleave",
    onDragOver: "dragover",
    onDragStart: "dragstart",
    onDrop: "drop",
    onFocus: "focus",
    onGutterClick: "gutterClick",
    onKeyDown: "keydown",
    onKeyPress: "keypress",
    onKeyUp: "keyup",
    onMouseDown: "mousedown",
    onPaste: "paste",
    onRenderLine: "renderLine",
    onScroll: "scroll",
    onSelection: "beforeSelectionChange",
    onTouchStart: "touchstart",
    onUpdate: "update",
    onViewportChange: "viewportChange"
  };

  constructor(editor) {
    this.editor = editor;
  }

  delegateCursor(
    position: codemirror.Position,
    scroll?: boolean,
    focus?: boolean
  ) {
    const doc = this.editor.getDoc() as codemirror.Doc;

    if (focus) {
      this.editor.focus();
    }

    scroll
      ? doc.setCursor(position)
      : doc.setCursor(position, null, { scroll: false });
  }

  delegateScroll(coordinates: ISetScrollOptions) {
    this.editor.scrollTo(coordinates.x, coordinates.y);
  }

  delegateSelection(ranges: Array<ISetSelectionOptions>, focus?: boolean) {
    const doc = this.editor.getDoc() as codemirror.Doc;
    doc.setSelections(ranges);

    if (focus) {
      this.editor.focus();
    }
  }

  public apply(props: IControlledCodeMirror | IUnControlledCodeMirror) {
    // init ranges
    if (props && props.selection && props.selection.ranges) {
      this.delegateSelection(
        props.selection.ranges,
        props.selection.focus || false
      );
    }

    // init cursor
    if (props && props.cursor) {
      this.delegateCursor(
        props.cursor,
        props.autoScroll || false,
        this.editor.getOption("autofocus") || false
      );
    }

    // init scroll
    if (props && props.scroll) {
      this.delegateScroll(props.scroll);
    }
  }

  public applyNext(
    props: IControlledCodeMirror | IUnControlledCodeMirror,
    next?: IControlledCodeMirror | IUnControlledCodeMirror,
    preserved?: any
  ) {
    // handle new ranges
    if (props && props.selection && props.selection.ranges) {
      if (
        next &&
        next.selection &&
        next.selection.ranges &&
        !Helper.equals(props.selection.ranges, next.selection.ranges)
      ) {
        this.delegateSelection(
          next.selection.ranges,
          next.selection.focus || false
        );
      }
    }

    // handle new cursor
    if (props && props.cursor) {
      if (next && next.cursor && !Helper.equals(props.cursor, next.cursor)) {
        this.delegateCursor(
          preserved.cursor || next.cursor,
          next.autoScroll || false,
          next.autoCursor || false
        );
      }
    }

    // handle new scroll
    if (props && props.scroll) {
      if (next && next.scroll && !Helper.equals(props.scroll, next.scroll)) {
        this.delegateScroll(next.scroll);
      }
    }
  }

  public applyUserDefined(
    props: IControlledCodeMirror | IUnControlledCodeMirror,
    preserved?: any
  ) {
    if (preserved && preserved.cursor) {
      this.delegateCursor(
        preserved.cursor,
        props.autoScroll || false,
        this.editor.getOption("autofocus") || false
      );
    }
  }

  public wire(
    prevProps: IControlledCodeMirror | IUnControlledCodeMirror,
    props: IControlledCodeMirror | IUnControlledCodeMirror
  ) {
    Object.keys(props || {})
      .filter(prop => this.eventMappings[prop] !== undefined)
      .filter(prop => props[prop] !== prevProps[prop])
      .forEach(prop => {
        const event = this.eventMappings[prop];

        // Get rid of previous listener if present
        if (prevProps[prop] !== undefined) {
          this.editor.off(event, prevProps[prop]);
        }

        this.editor.on(event, props[prop]);
      });
  }

  public unwire(props: IControlledCodeMirror | IUnControlledCodeMirror) {
    Object.keys(props || {})
      .filter(prop => this.eventMappings[prop] !== undefined)
      .forEach(prop => {
        const event = this.eventMappings[prop];
        this.editor.off(event, props[prop]);
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
  private editor: codemirror.Editor;
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
    const _options = props && props.options ? props.options : {};

    const userDefinedOptions = Object.assign(
      {},
      cm.defaults,
      (this.editor as any).options,
      _options
    );

    const optionDelta = Object.keys(userDefinedOptions).some(
      key => this.editor.getOption(key) !== userDefinedOptions[key]
    );

    if (optionDelta) {
      Object.keys(userDefinedOptions).forEach(key => {
        if (_options.hasOwnProperty(key)) {
          if (this.editor.getOption(key) !== userDefinedOptions[key]) {
            this.editor.setOption(key, userDefinedOptions[key]);
            this.mirror.setOption(key, userDefinedOptions[key]);
          }
        }
      });
    }
    if (!this.hydrated) {
      this.deferred ? this.resolveChange() : this.initChange(props.value || "");
    }
    this.hydrated = true;
  }

  /** @internal */
  private initChange(value) {
    this.emulating = true;

    const doc = this.editor.getDoc();
    const lastLine = doc.lastLine();
    const lastChar = doc.getLine(doc.lastLine()).length;

    doc.replaceRange(
      value || "",
      { line: 0, ch: 0 },
      { line: lastLine, ch: lastChar }
    );

    this.mirror.setValue(value);
    doc.clearHistory();
    this.mirror.clearHistory();

    this.emulating = false;
  }

  /** @internal */
  private resolveChange() {
    this.emulating = true;

    const doc = this.editor.getDoc();

    if (this.deferred.origin === "undo") {
      doc.undo();
    } else if (this.deferred.origin === "redo") {
      doc.redo();
    } else {
      doc.replaceRange(
        this.deferred.text,
        this.deferred.from,
        this.deferred.to,
        this.deferred.origin
      );
    }

    this.emulating = false;
    this.deferred = null;
  }

  /** @internal */
  private mirrorChange(deferred) {
    const doc = this.editor.getDoc();

    if (deferred.origin === "undo") {
      doc.setHistory(this.mirror.getHistory());
      this.mirror.undo();
    } else if (deferred.origin === "redo") {
      doc.setHistory(this.mirror.getHistory());
      this.mirror.redo();
    } else {
      this.mirror.replaceRange(
        deferred.text,
        deferred.from,
        deferred.to,
        deferred.origin
      );
    }

    return this.mirror.getValue();
  }

  /** @internal */
  public componentDidMount() {
    if (SERVER_RENDERED) return;

    if (this.props.defineMode) {
      if (this.props.defineMode.name && this.props.defineMode.fn) {
        cm.defineMode(this.props.defineMode.name, this.props.defineMode.fn);
      }
    }

    this.editor = cm(this.ref) as codemirror.Editor;

    this.shared = new Shared(this.editor);

    this.mirror = (cm as any)(() => {});

    this.editor.on("electricInput", () => {
      this.mirror.setHistory(this.editor.getDoc().getHistory());
    });

    this.editor.on("cursorActivity", () => {
      this.mirror.setCursor(this.editor.getDoc().getCursor());
    });

    this.editor.on("beforeChange", (cm, data) => {
      if (this.emulating) {
        return;
      }

      data.cancel();

      this.deferred = data;

      let phantomChange = this.mirrorChange(this.deferred);

      if (this.props.onBeforeChange)
        this.props.onBeforeChange(this.editor, this.deferred, phantomChange);
    });

    this.editor.on("change", (cm, data) => {
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

    this.shared.wire({}, this.props);

    if (this.editor.getOption("autofocus")) {
      this.editor.focus();
    }

    if (this.props.editorDidMount) {
      this.props.editorDidMount(
        this.editor,
        this.editor.getValue(),
        this.initCb
      );
    }
  }

  public componentDidUpdate(prevProps) {
    this.shared.wire(prevProps, this.props);
  }

  /** @internal */
  public componentWillReceiveProps(nextProps) {
    if (SERVER_RENDERED) return;

    let preserved: IPreservedOptions = { cursor: null };

    if (nextProps.value !== this.props.value) {
      this.hydrated = false;
    }

    if (!this.props.autoCursor && this.props.autoCursor !== undefined) {
      preserved.cursor = this.editor.getDoc().getCursor();
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
    return !SERVER_RENDERED;
  }

  /** @internal */
  public render() {
    if (SERVER_RENDERED) return null;

    let className = this.props.className
      ? `react-codemirror2 ${this.props.className}`
      : "react-codemirror2";

    return <div className={className} ref={self => (this.ref = self)} />;
  }
}

export class UnControlled extends React.Component<
  IUnControlledCodeMirror,
  any
> {
  /** @internal */
  private applied: boolean;
  /** @internal */
  private appliedUserDefined: boolean;
  /** @internal */
  private continueChange: boolean;
  /** @internal */
  private detached: boolean;
  /** @internal */
  private editor: codemirror.Editor;
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
    const _options = props && props.options ? props.options : {};
    const userDefinedOptions = Object.assign(
      {},
      cm.defaults,
      (this.editor as any).options,
      _options
    );
    const optionDelta = Object.keys(userDefinedOptions).some(
      key => this.editor.getOption(key) !== userDefinedOptions[key]
    );

    if (optionDelta) {
      Object.keys(userDefinedOptions).forEach(key => {
        if (_options.hasOwnProperty(key)) {
          if (this.editor.getOption(key) !== userDefinedOptions[key]) {
            this.editor.setOption(key, userDefinedOptions[key]);
          }
        }
      });
    }

    if (!this.hydrated) {
      const doc = this.editor.getDoc();
      const lastLine = doc.lastLine();
      const lastChar = doc.getLine(doc.lastLine()).length;

      doc.replaceRange(
        props.value || "",
        { line: 0, ch: 0 },
        { line: lastLine, ch: lastChar }
      );
    }

    this.hydrated = true;
  }

  /** @internal */
  public componentDidMount() {
    if (SERVER_RENDERED) return;

    this.detached = this.props.detach === true;

    if (this.props.defineMode) {
      if (this.props.defineMode.name && this.props.defineMode.fn) {
        cm.defineMode(this.props.defineMode.name, this.props.defineMode.fn);
      }
    }

    this.editor = cm(this.ref) as codemirror.Editor;

    this.shared = new Shared(this.editor);

    this.editor.on("beforeChange", (cm, data) => {
      if (this.props.onBeforeChange) {
        this.props.onBeforeChange(
          this.editor,
          data,
          this.editor.getValue(),
          this.onBeforeChangeCb
        );
      }
    });

    this.editor.on("change", (cm, data) => {
      if (!this.mounted || !this.props.onChange) {
        return;
      }

      if (this.props.onBeforeChange) {
        if (this.continueChange) {
          this.props.onChange(this.editor, data, this.editor.getValue());
        }
      } else {
        this.props.onChange(this.editor, data, this.editor.getValue());
      }
    });

    this.hydrate(this.props);

    this.shared.apply(this.props);

    this.applied = true;

    this.mounted = true;

    this.shared.wire({}, this.props);

    this.editor.getDoc().clearHistory();

    if (this.props.editorDidMount) {
      this.props.editorDidMount(
        this.editor,
        this.editor.getValue(),
        this.initCb
      );
    }
  }

  public componentDidUpdate(prevProps) {
    this.shared.wire(prevProps, this.props);
  }

  /** @internal */
  public componentWillReceiveProps(nextProps) {
    if (this.detached && nextProps.detach === false) {
      this.detached = false;
      if (this.props.editorDidAttach) {
        this.props.editorDidAttach(this.editor);
      }
    }

    if (!this.detached && nextProps.detach === true) {
      this.detached = true;
      if (this.props.editorDidDetach) {
        this.props.editorDidDetach(this.editor);
      }
    }

    if (SERVER_RENDERED || this.detached) return;

    let preserved: IPreservedOptions = { cursor: null };

    if (nextProps.value !== this.props.value) {
      this.hydrated = false;
      this.applied = false;
      this.appliedUserDefined = false;
    }

    if (!this.props.autoCursor && this.props.autoCursor !== undefined) {
      preserved.cursor = this.editor.getDoc().getCursor();
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

    this.shared.unwire(this.props);
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

    let className = this.props.className
      ? `react-codemirror2 ${this.props.className}`
      : "react-codemirror2";

    return <div className={className} ref={self => (this.ref = self)} />;
  }
}
