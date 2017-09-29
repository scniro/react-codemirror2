'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var codemirror = require('codemirror');

var CodeMirror = function (_React$Component) {
  _inherits(CodeMirror, _React$Component);

  function CodeMirror(props) {
    _classCallCheck(this, CodeMirror);

    var _this = _possibleConstructorReturn(this, (CodeMirror.__proto__ || Object.getPrototypeOf(CodeMirror)).call(this, props));

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

  _createClass(CodeMirror, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      if (this.props.editorWillMount) {
        this.props.editorWillMount();
      }
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      if (this.props.defineMode) {
        if (this.props.defineMode.name && this.props.defineMode.fn) {
          codemirror.defineMode(this.props.defineMode.name, this.props.defineMode.fn);
        }
      }

      this.editor = codemirror(this.ref);

      this.editor.on('beforeChange', function (cm, changeObj) {
        if (_this2.props.onBeforeChange && _this2.hydrated) {
          _this2.props.onBeforeChange(_this2.editor, changeObj, _this2.onBeforeChangeCb);
        }
      });

      this.editor.on('change', function (cm, metadata) {

        if (_this2.props.onChange && _this2.hydrated) {

          if (_this2.props.onBeforeChange) {
            if (_this2.continuePreChange) {
              _this2.props.onChange(_this2.editor, metadata, _this2.editor.getValue());
            }
          } else {
            _this2.props.onChange(_this2.editor, metadata, _this2.editor.getValue());
          }
        }
      });

      if (this.props.onCursorActivity) {
        this.editor.on('cursorActivity', function (cm) {
          _this2.props.onViewportChange(_this2.editor);
        });
      }

      if (this.props.onViewportChange) {
        this.editor.on('viewportChange', function (cm, start, end) {
          _this2.props.onViewportChange(_this2.editor, start, end);
        });
      }

      if (this.props.onGutterClick) {
        this.editor.on('gutterClick', function (cm, lineNumber, event) {
          _this2.props.onGutterClick(_this2.editor, lineNumber, event);
        });
      }

      if (this.props.onFocus) {
        this.editor.on('focus', function (cm, event) {
          _this2.props.onFocus(_this2.editor, event);
        });
      }

      if (this.props.onBlur) {
        this.editor.on('blur', function (cm, event) {
          _this2.props.onBlur(_this2.editor, event);
        });
      }

      if (this.props.onUpdate) {
        this.editor.on('update', function (cm, event) {
          _this2.props.onUpdate(_this2.editor, event);
        });
      }

      if (this.props.onKeyDown) {
        this.editor.on('keydown', function (cm, event) {
          _this2.props.onKeyDown(_this2.editor, event);
        });
      }

      if (this.props.onKeyUp) {
        this.editor.on('keyup', function (cm, event) {
          _this2.props.onKeyUp(_this2.editor, event);
        });
      }

      if (this.props.onKeyPress) {
        this.editor.on('keypress', function (cm, event) {
          _this2.props.onKeyPress(_this2.editor, event);
        });
      }

      if (this.props.onDragEnter) {
        this.editor.on('dragenter', function (cm, event) {
          _this2.props.onDragEnter(_this2.editor, event);
        });
      }

      if (this.props.onDragOver) {
        this.editor.on('dragover', function (cm, event) {
          _this2.props.onDragOver(_this2.editor, event);
        });
      }

      if (this.props.onDrop) {
        this.editor.on('drop', function (cm, event) {
          _this2.props.onDrop(_this2.editor, event);
        });
      }

      if (this.props.onSelection) {
        this.editor.on('beforeSelectionChange', function (cm, meta) {
          _this2.props.onSelection(_this2.editor, meta.ranges);
        });
      }

      if (this.props.onScroll) {
        this.editor.on('scroll', function (cm) {

          var meta = _this2.editor.getScrollInfo();

          _this2.props.onScroll(_this2.editor, {
            x: meta.left,
            y: meta.top
          });
        });
      }

      if (this.props.onCursor) {
        this.editor.on('cursorActivity', function (cm) {

          var meta = _this2.editor.getCursor();

          _this2.props.onCursor(_this2.editor, {
            line: meta.line,
            ch: meta.ch
          });
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
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {

      if (this.props.value !== nextProps.value) {
        this.hydrated = false;
      }

      if (!this.props.resetCursorOnSet) {
        this.cursorPos = this.editor.getCursor();
      }

      this.hydrate(nextProps);

      if (!this.props.resetCursorOnSet) {

        !this.props.autoScrollCursorOnSet && this.props.autoScrollCursorOnSet !== undefined ? this.editor.setCursor(this.cursorPos, null, { scroll: false }) : this.editor.setCursor(this.cursorPos);
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {

      if (this.props.editorWillUnmount) {
        this.props.editorWillUnmount(codemirror);
      }
    }
  }, {
    key: 'hydrate',
    value: function hydrate(props) {
      var _this3 = this;

      Object.keys(props.options || {}).forEach(function (key) {
        return _this3.editor.setOption(key, props.options[key]);
      });

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
        } else {
          if (this.props.onSet) {
            this.props.onSet(this.editor, this.editor.getValue());
          }
        }
      }

      this.hydrated = true;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      var className = this.props.className ? 'react-codemirror2 ' + this.props.className : 'react-codemirror2';

      return _react2.default.createElement('div', { className: className, ref: function ref(self) {
          return _this4.ref = self;
        } });
    }
  }]);

  return CodeMirror;
}(_react2.default.Component);

exports.default = CodeMirror;