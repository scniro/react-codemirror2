import React from 'react';
import {connect} from 'react-redux';
import Toggle from './Toggle.jsx';
import * as actions from '../actions';

class Controls extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      controlled: false
    }
  }

  onThemeSelect(e) {

    this.props.dispatch(actions.toggleTheme(e.target.value));
  }

  onModeSelect(e) {

    this.props.dispatch(actions.toggleMode(e.target.value));
  }

  onToggleState(value) {

    let controlled = value === 'CONTROLLED';

    this.props.onToggleState(controlled);
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
          <option value='strings'>strings (custom)</option>
        </select>

        <Toggle className='state-control'
                left='CONTROLLED'
                right='UNCONTROLLED'
                checked={this.state.controlled}
                onChange={this.onToggleState.bind(this)}/>
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
