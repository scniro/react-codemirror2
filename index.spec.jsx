import React from 'react';
import CodeMirror from './index.js';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme, {mount} from 'enzyme';

Enzyme.configure({adapter: new Adapter()});

describe('CodeMirror:init', () => {

  let props;
  let mounted;
  const editor = () => {
    if (!mounted) {
      mounted = mount(
        <CodeMirror {...props} />
      );
    }
    return mounted;
  };

  beforeEach(() => {
    props = {};
    mounted = undefined;
  });

  it('should render | props: {}', () => {
    let rendered = editor();
    expect.anything(rendered);
  });
});