'use strict';
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
Object.defineProperty(exports, '__esModule', { value: true });
var React = require('react');
var cm;
var SERVER_RENDERED = typeof navigator === 'undefined';
if (!SERVER_RENDERED) {
    cm = require('codemirror');
}
var Shared = (function () {
    function Shared(editor, props) {
        this.editor = editor;
        this.props = props;
        this.notifyOfDeprecation();
    }
    Shared.prototype.notifyOfDeprecation = function () {
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
    };
    Shared.prototype.wire = function (name) {
        var _this = this;
        switch (name) {
            case 'onBlur':
                {
                    this.editor.on('blur', function (cm, event) {
                        _this.props.onBlur(_this.editor, event);
                    });
                }
                break;
            case 'onCursor':
                {
                    this.editor.on('cursorActivity', function (cm) {
                        _this.props.onCursor(_this.editor, _this.editor.getCursor());
                    });
                }
                break;
            case 'onCursorActivity':
                {
                    this.editor.on('cursorActivity', function (cm) {
                        _this.props.onCursorActivity(_this.editor);
                    });
                }
                break;
            case 'onDragEnter':
                {
                    this.editor.on('dragenter', function (cm, event) {
                        _this.props.onDragEnter(_this.editor, event);
                    });
                }
                break;
            case 'onDragOver':
                {
                    this.editor.on('dragover', function (cm, event) {
                        _this.props.onDragOver(_this.editor, event);
                    });
                }
                break;
            case 'onDrop':
                {
                    this.editor.on('drop', function (cm, event) {
                        _this.props.onDrop(_this.editor, event);
                    });
                }
                break;
            case 'onFocus':
                {
                    this.editor.on('focus', function (cm, event) {
                        _this.props.onFocus(_this.editor, event);
                    });
                }
                break;
            case 'onGutterClick':
                {
                    this.editor.on('gutterClick', function (cm, lineNumber, gutter, event) {
                        _this.props.onGutterClick(_this.editor, lineNumber, gutter, event);
                    });
                }
                break;
            case 'onKeyDown':
                {
                    this.editor.on('keydown', function (cm, event) {
                        _this.props.onKeyDown(_this.editor, event);
                    });
                }
                break;
            case 'onKeyPress':
                {
                    this.editor.on('keypress', function (cm, event) {
                        _this.props.onKeyPress(_this.editor, event);
                    });
                }
                break;
            case 'onKeyUp':
                {
                    this.editor.on('keyup', function (cm, event) {
                        _this.props.onKeyUp(_this.editor, event);
                    });
                }
                break;
            case 'onScroll':
                {
                    this.editor.on('scroll', function (cm) {
                        _this.props.onScroll(_this.editor, _this.editor.getScrollInfo());
                    });
                }
                break;
            case 'onSelection':
                {
                    this.editor.on('beforeSelectionChange', function (cm, data) {
                        _this.props.onSelection(_this.editor, data);
                    });
                }
                break;
            case 'onUpdate':
                {
                    this.editor.on('update', function (cm) {
                        _this.props.onUpdate(_this.editor);
                    });
                }
                break;
            case 'onViewportChange':
                {
                    this.editor.on('viewportChange', function (cm, from, to) {
                        _this.props.onViewportChange(_this.editor, from, to);
                    });
                }
                break;
        }
    };
    return Shared;
}());
var Controlled = (function (_super) {
    __extends(Controlled, _super);
    function Controlled(props) {
        var _this = _super.call(this, props) || this;
        if (SERVER_RENDERED)
            return _this;
        _this.deferred = null;
        _this.emulating = false;
        _this.hydrated = false;
        _this.initCb = function () {
            if (_this.props.editorDidConfigure) {
                _this.props.editorDidConfigure(_this.editor);
            }
        };
        _this.mounted = false;
        return _this;
    }
    Controlled.prototype.setCursor = function (cursorPos, scroll, focus) {
        var doc = this.editor.getDoc();
        if (focus) {
            this.editor.focus();
        }
        if (scroll) {
            doc.setCursor(cursorPos);
        }
        else {
            doc.setCursor(cursorPos, null, { scroll: false });
        }
    };
    Controlled.prototype.moveCursor = function (cursorPos, scroll) {
        var doc = this.editor.getDoc();
        if (scroll) {
            doc.setCursor(cursorPos);
        }
        else {
            doc.setCursor(cursorPos, null, { scroll: false });
        }
    };
    Controlled.prototype.hydrate = function (props) {
        var _this = this;
        Object.keys(props.options || {}).forEach(function (key) {
            _this.editor.setOption(key, props.options[key]);
            _this.mirror.setOption(key, props.options[key]);
        });
        if (!this.hydrated) {
            if (!this.mounted) {
                this.initChange(props.value || '');
            }
            else {
                if (this.deferred) {
                    this.resolveChange();
                }
                else {
                    this.initChange(props.value || '');
                }
            }
        }
        this.hydrated = true;
    };
    Controlled.prototype.initChange = function (value) {
        this.emulating = true;
        var lastLine = this.editor.lastLine();
        var lastChar = this.editor.getLine(this.editor.lastLine()).length;
        this.editor.replaceRange(value || '', { line: 0, ch: 0 }, { line: lastLine, ch: lastChar });
        this.mirror.setValue(value);
        this.editor.clearHistory();
        this.mirror.clearHistory();
        this.emulating = false;
    };
    Controlled.prototype.resolveChange = function () {
        this.emulating = true;
        if (this.deferred.origin === 'undo') {
            this.editor.undo();
        }
        else if (this.deferred.origin === 'redo') {
            this.editor.redo();
        }
        else {
            this.editor.replaceRange(this.deferred.text, this.deferred.from, this.deferred.to, this.deferred.origin);
        }
        this.emulating = false;
        this.deferred = null;
    };
    Controlled.prototype.mirrorChange = function (deferred) {
        if (deferred.origin === 'undo') {
            this.editor.setHistory(this.mirror.getHistory());
            this.mirror.undo();
        }
        else if (deferred.origin === 'redo') {
            this.editor.setHistory(this.mirror.getHistory());
            this.mirror.redo();
        }
        else {
            this.mirror.replaceRange(deferred.text, deferred.from, deferred.to, deferred.origin);
        }
        return this.mirror.getValue();
    };
    Controlled.prototype.componentWillMount = function () {
        if (SERVER_RENDERED)
            return;
        if (this.props.editorWillMount) {
            this.props.editorWillMount();
        }
    };
    Controlled.prototype.componentDidMount = function () {
        var _this = this;
        if (SERVER_RENDERED)
            return;
        if (this.props.defineMode) {
            if (this.props.defineMode.name && this.props.defineMode.fn) {
                cm.defineMode(this.props.defineMode.name, this.props.defineMode.fn);
            }
        }
        this.editor = cm(this.ref);
        this.shared = new Shared(this.editor, this.props);
        this.mirror = cm(function () {
        });
        this.editor.on('electricInput', function () {
            _this.mirror.setHistory(_this.editor.getHistory());
        });
        this.editor.on('cursorActivity', function () {
            _this.mirror.setCursor(_this.editor.getCursor());
        });
        this.editor.on('beforeChange', function (cm, data) {
            if (_this.emulating) {
                return;
            }
            data.cancel();
            _this.deferred = data;
            var phantomChange = _this.mirrorChange(_this.deferred);
            if (_this.props.onBeforeChange)
                _this.props.onBeforeChange(_this.editor, _this.deferred, phantomChange);
        });
        this.editor.on('change', function (cm, data) {
            if (!_this.mounted) {
                return;
            }
            if (_this.props.onChange) {
                _this.props.onChange(_this.editor, data, _this.editor.getValue());
            }
        });
        if (this.props.onBlur)
            this.shared.wire('onBlur');
        if (this.props.onCursor)
            this.shared.wire('onCursor');
        if (this.props.onCursorActivity)
            this.shared.wire('onCursorActivity');
        if (this.props.onDragEnter)
            this.shared.wire('onDragEnter');
        if (this.props.onDragOver)
            this.shared.wire('onDragOver');
        if (this.props.onDrop)
            this.shared.wire('onDrop');
        if (this.props.onFocus)
            this.shared.wire('onFocus');
        if (this.props.onGutterClick)
            this.shared.wire('onGutterClick');
        if (this.props.onKeyDown)
            this.shared.wire('onKeyDown');
        if (this.props.onKeyPress)
            this.shared.wire('onKeyPress');
        if (this.props.onKeyUp)
            this.shared.wire('onKeyUp');
        if (this.props.onScroll)
            this.shared.wire('onScroll');
        if (this.props.onSelection)
            this.shared.wire('onSelection');
        if (this.props.onUpdate)
            this.shared.wire('onUpdate');
        if (this.props.onViewportChange)
            this.shared.wire('onViewportChange');
        this.hydrate(this.props);
        if (this.props.selection) {
            var doc = this.editor.getDoc();
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
    };
    Controlled.prototype.componentWillReceiveProps = function (nextProps) {
        if (SERVER_RENDERED)
            return;
        var cursorPos;
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
    };
    Controlled.prototype.componentWillUnmount = function () {
        if (SERVER_RENDERED)
            return;
        if (this.props.editorWillUnmount) {
            this.props.editorWillUnmount(cm);
        }
    };
    Controlled.prototype.shouldComponentUpdate = function (nextProps, nextState) {
        return !SERVER_RENDERED;
    };
    Controlled.prototype.render = function () {
        var _this = this;
        if (SERVER_RENDERED)
            return null;
        var className = this.props.className ? 'react-codemirror2 ' + this.props.className : 'react-codemirror2';
        return (React.createElement('div', { className: className, ref: function (self) { return _this.ref = self; } }));
    };
    return Controlled;
}(React.Component));
exports.Controlled = Controlled;
var UnControlled = (function (_super) {
    __extends(UnControlled, _super);
    function UnControlled(props) {
        var _this = _super.call(this, props) || this;
        if (SERVER_RENDERED)
            return _this;
        _this.continueChange = false;
        _this.hydrated = false;
        _this.initCb = function () {
            if (_this.props.editorDidConfigure) {
                _this.props.editorDidConfigure(_this.editor);
            }
        };
        _this.mounted = false;
        _this.onBeforeChangeCb = function () {
            _this.continueChange = true;
        };
        return _this;
    }
    UnControlled.prototype.setCursor = function (cursorPos, scroll, focus) {
        var doc = this.editor.getDoc();
        if (focus) {
            this.editor.focus();
        }
        if (scroll) {
            doc.setCursor(cursorPos);
        }
        else {
            doc.setCursor(cursorPos, null, { scroll: false });
        }
    };
    UnControlled.prototype.moveCursor = function (cursorPos, scroll) {
        var doc = this.editor.getDoc();
        if (scroll) {
            doc.setCursor(cursorPos);
        }
        else {
            doc.setCursor(cursorPos, null, { scroll: false });
        }
    };
    UnControlled.prototype.hydrate = function (props) {
        var _this = this;
        Object.keys(props.options || {}).forEach(function (key) { return _this.editor.setOption(key, props.options[key]); });
        if (!this.hydrated) {
            var lastLine = this.editor.lastLine();
            var lastChar = this.editor.getLine(this.editor.lastLine()).length;
            this.editor.replaceRange(props.value || '', { line: 0, ch: 0 }, { line: lastLine, ch: lastChar });
        }
        this.hydrated = true;
    };
    UnControlled.prototype.componentWillMount = function () {
        if (SERVER_RENDERED)
            return;
        if (this.props.editorWillMount) {
            this.props.editorWillMount();
        }
    };
    UnControlled.prototype.componentDidMount = function () {
        var _this = this;
        if (SERVER_RENDERED)
            return;
        if (this.props.defineMode) {
            if (this.props.defineMode.name && this.props.defineMode.fn) {
                cm.defineMode(this.props.defineMode.name, this.props.defineMode.fn);
            }
        }
        this.editor = cm(this.ref);
        this.shared = new Shared(this.editor, this.props);
        this.editor.on('beforeChange', function (cm, data) {
            if (_this.props.onBeforeChange) {
                _this.props.onBeforeChange(_this.editor, data, null, _this.onBeforeChangeCb);
            }
        });
        this.editor.on('change', function (cm, data) {
            if (!_this.mounted) {
                return;
            }
            if (_this.props.onBeforeChange) {
                if (_this.continueChange) {
                    _this.props.onChange(_this.editor, data, _this.editor.getValue());
                }
                else {
                    return;
                }
            }
            else {
                _this.props.onChange(_this.editor, data, _this.editor.getValue());
            }
        });
        if (this.props.onBlur)
            this.shared.wire('onBlur');
        if (this.props.onCursor)
            this.shared.wire('onCursor');
        if (this.props.onCursorActivity)
            this.shared.wire('onCursorActivity');
        if (this.props.onDragEnter)
            this.shared.wire('onDragEnter');
        if (this.props.onDragOver)
            this.shared.wire('onDragOver');
        if (this.props.onDrop)
            this.shared.wire('onDrop');
        if (this.props.onFocus)
            this.shared.wire('onFocus');
        if (this.props.onGutterClick)
            this.shared.wire('onGutterClick');
        if (this.props.onKeyDown)
            this.shared.wire('onKeyDown');
        if (this.props.onKeyPress)
            this.shared.wire('onKeyPress');
        if (this.props.onKeyUp)
            this.shared.wire('onKeyUp');
        if (this.props.onScroll)
            this.shared.wire('onScroll');
        if (this.props.onSelection)
            this.shared.wire('onSelection');
        if (this.props.onUpdate)
            this.shared.wire('onUpdate');
        if (this.props.onViewportChange)
            this.shared.wire('onViewportChange');
        this.hydrate(this.props);
        if (this.props.selection) {
            var doc = this.editor.getDoc();
            doc.setSelections(this.props.selection);
        }
        if (this.props.cursor) {
            this.setCursor(this.props.cursor, this.props.autoScroll || false, this.props.autoFocus || false);
        }
        if (this.props.scroll) {
            this.editor.scrollTo(this.props.scroll.x, this.props.scroll.y);
        }
        this.mounted = true;
        this.editor.clearHistory();
        if (this.props.editorDidMount) {
            this.props.editorDidMount(this.editor, this.editor.getValue(), this.initCb);
        }
    };
    UnControlled.prototype.componentWillReceiveProps = function (nextProps) {
        if (SERVER_RENDERED)
            return;
        var cursorPos;
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
    };
    UnControlled.prototype.componentWillUnmount = function () {
        if (SERVER_RENDERED)
            return;
        if (this.props.editorWillUnmount) {
            this.props.editorWillUnmount(cm);
        }
    };
    UnControlled.prototype.shouldComponentUpdate = function (nextProps, nextState) {
        return !SERVER_RENDERED;
    };
    UnControlled.prototype.render = function () {
        var _this = this;
        if (SERVER_RENDERED)
            return null;
        var className = this.props.className ? 'react-codemirror2 ' + this.props.className : 'react-codemirror2';
        return (React.createElement('div', { className: className, ref: function (self) { return _this.ref = self; } }));
    };
    return UnControlled;
}(React.Component));
exports.UnControlled = UnControlled;
