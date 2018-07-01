/// <reference types="codemirror" />
/// <reference types="react" />
import * as React from 'react';
import * as codemirror from 'codemirror';
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
export interface IDoc extends codemirror.Doc {
    setCursor: (pos: codemirror.Position, ch?: number, options?: {}) => void;
    setSelections: (ranges: Array<ISetSelectionOptions>) => void;
}
export interface IInstance extends codemirror.Editor, IDoc {
    options: codemirror.EditorConfiguration;
}
export interface DomEvent {
    (editor: IInstance, event: Event): void;
}
export interface ICodeMirror {
    autoCursor?: boolean;
    autoScroll?: boolean;
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
    onDragOver?: DomEvent;
    onDragStart?: DomEvent;
    onDrop?: DomEvent;
    onFocus?: DomEvent;
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
    options?: codemirror.EditorConfiguration;
    selection?: {
        ranges: Array<ISetSelectionOptions>;
        focus?: boolean;
    };
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
export declare class Controlled extends React.Component<IControlledCodeMirror, any> {
}
export declare class UnControlled extends React.Component<IUnControlledCodeMirror, any> {
}
