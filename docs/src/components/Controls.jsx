import React from 'react';
import {connect} from 'react-redux';
import * as actions from '../actions';

class Controls extends React.Component {

  onThemeSelect(e) {

    this.props.dispatch(actions.toggleTheme(e.target.value));
  }

  onModeSelect(e) {

    this.props.dispatch(actions.toggleMode(e.target.value));
  }

  render() {

    return (
      <div id='controls'>
        <select value={this.props.theme} onChange={this.onThemeSelect.bind(this)}>
          <option value='material'>material</option>
          <option value='xq-light'>xq-light</option>
        </select>

        <select value={this.props.mode} onChange={this.onModeSelect.bind(this)}>
          <option value='xml'>html</option>
          <option value='javascript'>javascript</option>
        </select>
      </div>
    )
  }
}

function mapState(state) {
  return {
    theme: state.app.theme,
    mode: state.app.mode
  }
}

export default connect(mapState)(Controls)