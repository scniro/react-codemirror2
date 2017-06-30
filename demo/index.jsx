import React from 'react';
import {render} from 'react-dom';
import Editor from './components/Editor.jsx'
import Controls from './components/Controls.jsx';

import {Provider} from 'react-redux';
import reducer from './reducers';
import {createStore, combineReducers} from 'redux';

require('./index.scss');

let initialState = {
  app: {
    theme: 'material'
  }
};

const app = combineReducers({
  app: reducer
});

const store = createStore(app, initialState);

render(
  <Provider store={store}>
    <div>
      <Controls />
      <Editor />
    </div>
  </Provider>
  , document.getElementById('app'));

