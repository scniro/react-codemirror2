/// <reference types="codemirror" />
/// <reference types="react" />
import * as React from 'react';
import * as codemirror from 'codemirror';
export interface IDefineModeOptions {
    fn: () => codemirror.Mode<any>;
    name: string;
}
export interface ISetScrollOptions {
    x: number;
    y: number;
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
}
export interface ICodeMirror {
    autoCursor?: boolean;
    autoFocus?: boolean;
    autoScroll?: boolean;
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
    onSelection?: (editor: IInstance, data: IGetSelectionOptions) => void;
    onUpdate?: (editor: IInstance) => void;
    onViewportChange?: (editor: IInstance, start: number, end: number) => void;
    options?: codemirror.EditorConfiguration;
    selection?: Array<ISetSelectionOptions>;
    scroll?: ISetScrollOptions;
    autoScrollCursorOnSet?: any;
    onBeforeSet?: any;
    onSet?: any;
    resetCursorOnSet?: any;
}
export interface IControlledCodeMirror extends ICodeMirror {
    onBeforeChange: (editor: IInstance, data: codemirror.EditorChange, value: string) => void;
    value: string;
}
export interface IUnControlledCodeMirror extends ICodeMirror {
    onBeforeChange?: (editor: IInstance, data: codemirror.EditorChange, value: string, next: () => void) => void;
    value?: string;
}
export declare class Controlled extends React.Component<IControlledCodeMirror, any> {
}
export declare class UnControlled extends React.Component<IUnControlledCodeMirror, any> {
}
