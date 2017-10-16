import React from 'react';
import Editor from './Editor.jsx'
import Controls from './Controls.jsx';
import Syntax from './Syntax.jsx';

export default class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      controlled: true
    }
  }

  render() {

    return (
      <div id='container'>
        <header>
          <a href="https://github.com/scniro/react-codemirror2" target="_blank"><h1>scniro/react-codemirror2</h1></a>
        </header>
        <Controls onToggleState={(controlled) => {
          this.setState({controlled});
        }}/>
        <div id='pane-container'>
          <section>
            <Editor controlled={this.state.controlled}/>
          </section>
          <section>
            <Syntax controlled={this.state.controlled}/>
          </section>
        </div>
      </div>
    );
  }
}