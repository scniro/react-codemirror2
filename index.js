"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var codemirror = require("codemirror");
var CodeMirror = /** @class */ (function (_super) {
    __extends(CodeMirror, _super);
    /** @internal */
    function CodeMirror(props) {
        var _this = _super.call(this, props) || this;
        _this.hydrated = false;
        _this.continuePreSet = false;
        _this.continuePreChange = false;
        _this.onBeforeChangeCb = function () {
            _this.continuePreChange = true;
        };
        _this.onBeforeSetCb = function () {
            _this.continuePreSet = true;
        };
        _this.initCb = function () {
            if (_this.props.editorDidConfigure) {
                _this.props.editorDidConfigure(_this.editor);
            }
        };
        return _this;
    }
    /** @internal */
    CodeMirror.prototype.componentWillMount = function () {
        if (this.props.editorWillMount) {
            this.props.editorWillMount();
        }
    };
    /** @internal */
    CodeMirror.prototype.componentDidMount = function () {
        var _this = this;
        if (this.props.defineMode) {
            if (this.props.defineMode.name && this.props.defineMode.fn) {
                codemirror.defineMode(this.props.defineMode.name, this.props.defineMode.fn);
            }
        }
        this.editor = codemirror(this.ref);
        this.editor.on('beforeChange', function (cm, data) {
            if (_this.props.onBeforeChange && _this.hydrated) {
                _this.props.onBeforeChange(_this.editor, data, _this.onBeforeChangeCb);
            }
        });
        this.editor.on('change', function (cm, data) {
            if (_this.props.onChange && _this.hydrated) {
                if (_this.props.onBeforeChange) {
                    if (_this.continuePreChange) {
                        _this.props.onChange(_this.editor, data, _this.editor.getValue());
                    }
                }
                else {
                    _this.props.onChange(_this.editor, data, _this.editor.getValue());
                }
            }
        });
        if (this.props.onCursorActivity) {
            this.editor.on('cursorActivity', function (cm) {
                _this.props.onCursorActivity(_this.editor);
            });
        }
        if (this.props.onViewportChange) {
            this.editor.on('viewportChange', function (cm, start, end) {
                _this.props.onViewportChange(_this.editor, start, end);
            });
        }
        if (this.props.onGutterClick) {
            this.editor.on('gutterClick', function (cm, lineNumber, gutter, event) {
                _this.props.onGutterClick(_this.editor, lineNumber, gutter, event);
            });
        }
        if (this.props.onFocus) {
            this.editor.on('focus', function (cm, event) {
                _this.props.onFocus(_this.editor, event);
            });
        }
        if (this.props.onBlur) {
            this.editor.on('blur', function (cm, event) {
                _this.props.onBlur(_this.editor, event);
            });
        }
        if (this.props.onUpdate) {
            this.editor.on('update', function (cm, event) {
                _this.props.onUpdate(_this.editor, event);
            });
        }
        if (this.props.onKeyDown) {
            this.editor.on('keydown', function (cm, event) {
                _this.props.onKeyDown(_this.editor, event);
            });
        }
        if (this.props.onKeyUp) {
            this.editor.on('keyup', function (cm, event) {
                _this.props.onKeyUp(_this.editor, event);
            });
        }
        if (this.props.onKeyPress) {
            this.editor.on('keypress', function (cm, event) {
                _this.props.onKeyPress(_this.editor, event);
            });
        }
        if (this.props.onDragEnter) {
            this.editor.on('dragenter', function (cm, event) {
                _this.props.onDragEnter(_this.editor, event);
            });
        }
        if (this.props.onDragOver) {
            this.editor.on('dragover', function (cm, event) {
                _this.props.onDragOver(_this.editor, event);
            });
        }
        if (this.props.onDrop) {
            this.editor.on('drop', function (cm, event) {
                _this.props.onDrop(_this.editor, event);
            });
        }
        if (this.props.onSelection) {
            this.editor.on('beforeSelectionChange', function (cm, data) {
                _this.props.onSelection(_this.editor, data.ranges);
            });
        }
        if (this.props.onScroll) {
            this.editor.on('scroll', function (cm) {
                _this.props.onScroll(_this.editor, _this.editor.getScrollInfo());
            });
        }
        if (this.props.onCursor) {
            this.editor.on('cursorActivity', function (cm) {
                _this.props.onCursor(_this.editor, _this.editor.getCursor());
            });
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
    };
    /** @internal */
    CodeMirror.prototype.componentWillReceiveProps = function (nextProps) {
        var cursorPos;
        if (this.props.value !== nextProps.value) {
            this.hydrated = false;
        }
        if (!this.props.resetCursorOnSet) {
            cursorPos = this.editor.getCursor();
        }
        this.hydrate(nextProps);
        if (!this.props.resetCursorOnSet) {
            !this.props.autoScrollCursorOnSet && this.props.autoScrollCursorOnSet !== undefined ?
                this.editor.setCursor(cursorPos, null, { scroll: false }) : this.editor.setCursor(cursorPos);
        }
    };
    /** @internal */
    CodeMirror.prototype.componentWillUnmount = function () {
        if (this.props.editorWillUnmount) {
            this.props.editorWillUnmount(codemirror);
        }
    };
    /** @internal */
    CodeMirror.prototype.render = function () {
        var _this = this;
        var className = this.props.className ? "react-codemirror2 " + this.props.className : 'react-codemirror2';
        return (React.createElement("div", { className: className, ref: function (self) { return _this.ref = self; } }));
    };
    /** @internal */
    CodeMirror.prototype.hydrate = function (props) {
        var _this = this;
        Object.keys(props.options || {}).forEach(function (key) { return _this.editor.setOption(key, props.options[key]); });
        if (this.props.editorDidConfigure) {
            this.props.editorDidConfigure(this.editor);
        }
        if (!this.hydrated) {
            var lastLine = this.editor.lastLine();
            var lastChar = this.editor.getLine(this.editor.lastLine()).length;
            this.editor.replaceRange(props.value || '', { line: 0, ch: 0 }, { line: lastLine, ch: lastChar });
            if (this.props.onBeforeSet) {
                this.props.onBeforeSet(this.editor, this.onBeforeSetCb);
            }
            if (this.props.onBeforeSet) {
                if (this.continuePreSet && this.props.onSet) {
                    this.props.onSet(this.editor, this.editor.getValue());
                }
            }
            else {
                if (this.props.onSet) {
                    this.props.onSet(this.editor, this.editor.getValue());
                }
            }
        }
        this.hydrated = true;
    };
    return CodeMirror;
}(React.Component));
exports.default = CodeMirror;
