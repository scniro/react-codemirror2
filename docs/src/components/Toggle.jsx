import React from 'react';

export default class Toggle extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      checked: this.props.checked
    }

    // todo uncontrolled warning for default checked state
  }

  componentDidUpdate(prevProps, prevState) {

    if (this.props.checked !== prevProps.checked) {

      this.setState({
        checked: this.props.checked
      });
    }
  }

  onChange() {

    if (this.props.disabled) {
      return;
    }

    this.setState({
      checked: !this.state.checked
    }, () => {
      this.props.onChange(this.state.checked ? this.props.right : this.props.left);
    });
  }

  render() {
    return (
      <div className={`toggle-container ${this.props.className}`}>
        <div className="can-toggle" onClick={this.onChange.bind(this)}>
          <input id="a" type="checkbox" checked={this.state.checked || false} disabled={this.props.disabled}/>
          <label>
            <div htmlFor='a'
                 className="can-toggle__switch"
                 data-checked={this.props.right}
                 data-unchecked={this.props.left}/>
          </label>
        </div>
      </div>
    );
  }
}