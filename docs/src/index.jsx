import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, combineReducers} from 'redux';
import reducer from './reducers';
import Editor from './components/Editor.jsx'
import Controls from './components/Controls.jsx';
import Syntax from './components/Syntax.jsx';

require('./index.scss');
require('codemirror/mode/xml/xml');
require('codemirror/mode/javascript/javascript');
require('prismjs/components/prism-jsx');

let initialState = {
  app: {
    theme: 'xq-light',
    mode: 'xml'
  }
};

const app = combineReducers({
  app: reducer
});

const store = createStore(app, initialState);

render(
  <Provider store={store}>
    <div id='container'>
      <header>
        <a href="https://github.com/scniro/react-codemirror2" target="_blank"><h1>scniro/react-codemirror2</h1></a>
      </header>
      <Controls />
      <div id='pane-container'>
        <section>
          <Editor/>
        </section>
        <section>
          <Syntax/>
        </section>
      </div>
    </div>
  </Provider>
  , document.getElementById('app'));

