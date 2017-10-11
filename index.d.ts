/// <reference types="codemirror" />
/// <reference types="react" />
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
    anchor: codemirror.Position;
    head: codemirror.Position;
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
}
