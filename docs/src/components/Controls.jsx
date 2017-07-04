import React from 'react';
import {connect} from 'react-redux';
import * as actions from '../actions';

class Controls extends React.Component {

  onThemeSelect(e) {

    this.props.dispatch(actions.toggleTheme(e.target.value));
  }

  render() {

    return (
      <div>
        <select onChange={this.onThemeSelect.bind(this)}>
          <option value="material">material</option>
          <option value="monokai">monokai</option>
        </select>
      </div>
    )
  }
}

export default connect()(Controls)