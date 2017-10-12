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
export interface IDoc extends codemirror.Doc {
    setSelections: (ranges: Array<ISetSelectionOptions>) => void;
}
export interface IInstance extends codemirror.Editor, IDoc {
}
export interface ICodeMirror {
    value?: string;
    className?: string;
    defineMode?: IDefineModeOptions;
    editorDidConfigure?: (editor: IInstance) => void;
    cursor?: codemirror.Position;
    onSet?: (editor: IInstance, value: string) => void;
    onBeforeSet?: (editor: IInstance, cb: () => void) => void;
    autoScrollCursorOnSet?: boolean;
    resetCursorOnSet?: boolean;
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
}
export default class CodeMirror extends React.Component<ICodeMirror, any> {
}
