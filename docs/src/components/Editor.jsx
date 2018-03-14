import React from 'react';
import {connect} from 'react-redux';

import {Controlled} from '../../../index.js'
import {UnControlled} from '../../../index.js'

let jBeautify = require('js-beautify').js;
let hBeautify = require('js-beautify').html;

// http://marijnhaverbeke.nl/blog/codemirror-mode-system.html
let sampleMode = () => {
  return {
    startState: function () {
      return {inString: false};
    },
    token: function (stream, state) {
      // If a string starts here
      if (!state.inString && stream.peek() == '"') {
        stream.next();            // Skip quote
        state.inString = true;    // Update state
      }

      if (state.inString) {
        if (stream.skipTo('"')) { // Quote found on this line
          stream.next();          // Skip quote
          state.inString = false; // Clear flag
        } else {
          stream.skipToEnd();    // Rest of line is string
        }
        return "string";          // Token style
      } else {
        stream.skipTo('"') || stream.skipToEnd();
        return null;              // Unstyled token
      }
    }
  };
};

class Editor extends React.Component {

  constructor(props) {
    super(props);

    let exampleHTML = '<header class="site-header"><div class="container"><h1>Example #2</h1><nav role="navigation" class="site-navigation"><ul><li><a href="#">Link</a></li><li><a href="#">Link</a></li><li><a href="#">Link</a></li></ul></nav></div></header><section role="main" class="container"><img src="http://placehold.it/1400x400/ff694d/f6f2eb" class="banner-image"/><div class="grid-row col-3"><div class="grid-unit"><img src="http://placehold.it/650x300/ff694d/f6f2eb"/><p>Nullam quis risus eget urna mollis ornare vel eu leo. Donec id elit non mi porta gravida at eget metus. Curabitur blandit tempus porttitor.</p></div><div class="grid-unit"><img src="http://placehold.it/650x300/ff694d/f6f2eb"/><p>Nullam quis risus eget urna mollis ornare vel eu leo. Donec id elit non mi porta gravida at eget metus. Curabitur blandit tempus porttitor.</p></div><div class="grid-unit"><img src="http://placehold.it/650x300/ff694d/f6f2eb"/><p>Nullam quis risus eget urna mollis ornare vel eu leo. Donec id elit non mi porta gravida at eget metus. Curabitur blandit tempus porttitor.</p></div></div></section>';
    this.defaultHTML = hBeautify(exampleHTML, {indent_size: 2});

    let exampleJS = 'function StringStream(string) {  this.pos = 0;  this.string = string; }  StringStream.prototype = {  done: function() {return this.pos >= this.string.length;},  peek: function() {return this.string.charAt(this.pos);},  next: function() {  if (this.pos < this.string.length)  return this.string.charAt(this.pos++);  },  eat: function(match) {  var ch = this.string.charAt(this.pos);  if (typeof match == "string") var ok = ch == match;  else var ok = ch && match.test ? match.test(ch) : match(ch);  if (ok) {this.pos++; return ch;}  },  eatWhile: function(match) {  var start = this.pos;  while (this.eat(match));  if (this.pos > start) return this.string.slice(start, this.pos);  },  backUp: function(n) {this.pos -= n;},  column: function() {return this.pos;},  eatSpace: function() {  var start = this.pos;  while (/s/.test(this.string.charAt(this.pos))) this.pos++;  return this.pos - start;  },  match: function(pattern, consume, caseInsensitive) {  if (typeof pattern == "string") {  function cased(str) {return caseInsensitive ? str.toLowerCase() : str;}  if (cased(this.string).indexOf(cased(pattern), this.pos) == this.pos) {  if (consume !== false) this.pos += str.length;  return true;  }  }  else {  var match = this.string.slice(this.pos).match(pattern);  if (match && consume !== false) this.pos += match[0].length;  return match;  }  } };';
    this.defaultJS = jBeautify(exampleJS, {indent_size: 2});

    this.exampleCustomModeStrings = 'only "double quotes" will be tokenized\n\nsee http://marijnhaverbeke.nl/blog/codemirror-mode-system.html'
    this.state = {
      value: this.defaultHTML
    };
  }

  componentDidUpdate(prevProps, prevState) {

    if (this.props.controlled && !prevProps.controlled) {
      this.setControlledValue(this.props.mode);
    }

    if (this.props.controlled && (this.props.mode !== prevProps.mode)) {
      this.setControlledValue(this.props.mode);
    }
  }

  setControlledValue(mode) {
    switch (mode) {
      case 'xml':
        this.setState({value: this.defaultHTML});
        break;
      case 'javascript':
        this.setState({value: this.defaultJS});
        break;
      case 'strings':
        this.setState({value: this.exampleCustomModeStrings});
        break;
    }
  }

  getUncontrolledValue(mode) {
    switch (mode) {
      case 'xml':
        return this.defaultHTML;
        break;
      case 'javascript':
        return this.defaultJS;
        break;
      case 'strings':
        return this.exampleCustomModeStrings;
        break;
    }
  }

  renderEditor(controlled) {

    if (controlled) {
      return (
        <Controlled
          value={this.state.value}
          defineMode={{name: 'strings', fn: sampleMode}}
          options={{
            mode: this.props.mode,
            theme: this.props.theme,
            lineNumbers: true
          }}
          onBeforeChange={(editor, data, value) => {
            this.setState({value});
          }}
          onChange={(editor, data, value) => {
            console.log('controlled', {value});
          }}
        />
      )
    } else {
      return (
        <UnControlled
          detachOnMount={true}
          value={this.getUncontrolledValue(this.props.mode)}
          defineMode={{name: 'strings', fn: sampleMode}}
          detach={this.state.detach}
          options={{
            mode: this.props.mode,
            theme: this.props.theme,
            lineNumbers: true
          }}
          onChange={(editor, data, value) => {
            console.log('uncontrolled', {value});
          }}
        />
      )
    }
  }

  render() {
    return this.renderEditor(this.props.controlled)
  }
}

function mapState(state) {
  return {
    theme: state.app.theme,
    mode: state.app.mode
  }
}

export default connect(mapState)(Editor)
