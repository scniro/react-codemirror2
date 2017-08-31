import React from 'react';
import {connect} from 'react-redux';
import CodeMirror from '../../../index.js';

let jBeautify = require('js-beautify').js;
let hBeautify = require('js-beautify').html;

class Editor extends React.Component {

  constructor(props) {
    super(props);

    let exampleHTML = '<header class="site-header"> <div class="container"> <h1>Example #2</h1> <nav role="navigation" class="site-navigation"> <ul> <li><a href="#">Link</a></li><li><a href="#">Link</a></li><li><a href="#">Link</a></li></ul> </nav> </div></header> <section role="main" class="container"> <img src="http://placehold.it/1400x400/ff694d/f6f2eb" class="banner-image"/> <div class="grid-row col-3"> <div class="grid-unit"> <img src="http://placehold.it/650x300/ff694d/f6f2eb"/> <p>Nullam quis risus eget urna mollis ornare vel eu leo. Donec id elit non mi porta gravida at eget metus. Curabitur blandit tempus porttitor. </p></div><div class="grid-unit"> <img src="http://placehold.it/650x300/ff694d/f6f2eb"/> <p>Nullam quis risus eget urna mollis ornare vel eu leo. Donec id elit non mi porta gravida at eget metus. Curabitur blandit tempus porttitor. </p></div><div class="grid-unit"> <img src="http://placehold.it/650x300/ff694d/f6f2eb"/> <p>Nullam quis risus eget urna mollis ornare vel eu leo. Donec id elit non mi porta gravida at eget metus. Curabitur blandit tempus porttitor. </p></div></div></section>';
    this.defaultHTML = hBeautify(exampleHTML, {indent_size: 2});

    let exampleJS = 'function StringStream(string) {  this.pos = 0;  this.string = string; }  StringStream.prototype = {  done: function() {return this.pos >= this.string.length;},  peek: function() {return this.string.charAt(this.pos);},  next: function() {  if (this.pos < this.string.length)  return this.string.charAt(this.pos++);  },  eat: function(match) {  var ch = this.string.charAt(this.pos);  if (typeof match == "string") var ok = ch == match;  else var ok = ch && match.test ? match.test(ch) : match(ch);  if (ok) {this.pos++; return ch;}  },  eatWhile: function(match) {  var start = this.pos;  while (this.eat(match));  if (this.pos > start) return this.string.slice(start, this.pos);  },  backUp: function(n) {this.pos -= n;},  column: function() {return this.pos;},  eatSpace: function() {  var start = this.pos;  while (/s/.test(this.string.charAt(this.pos))) this.pos++;  return this.pos - start;  },  match: function(pattern, consume, caseInsensitive) {  if (typeof pattern == "string") {  function cased(str) {return caseInsensitive ? str.toLowerCase() : str;}  if (cased(this.string).indexOf(cased(pattern), this.pos) == this.pos) {  if (consume !== false) this.pos += str.length;  return true;  }  }  else {  var match = this.string.slice(this.pos).match(pattern);  if (match && consume !== false) this.pos += match[0].length;  return match;  }  } };';
    this.defaultJS = jBeautify(exampleJS, {indent_size: 2});
  }

  render() {

    return (
      <CodeMirror
        value={this.props.mode === 'xml' ? this.defaultHTML : this.defaultJS}
        options={{
          mode: this.props.mode,
          theme: this.props.theme,
          lineNumbers: true
        }}
        onSet={(editor, value) => {

          console.log('onSet', {value});
        }}
        onChange={(editor, metadata, value) => {

          console.log('onChange', {value});
        }}
      />
    )
  }
}

function mapState(state) {
  return {
    theme: state.app.theme,
    mode: state.app.mode
  }
}

export default connect(mapState)(Editor)