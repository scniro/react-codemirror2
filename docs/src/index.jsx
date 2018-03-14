import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, combineReducers} from 'redux';
import reducer from './reducers';
import App from './components/App.jsx';

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
    <App version={REACT_CODEMIRROR2_V}/>
  </Provider>
  , document.getElementById('app'));

