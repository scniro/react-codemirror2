import React from 'react';
import CodeMirror from './index.js';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme, {mount, shallow, render, ReactWrapper} from 'enzyme';

Enzyme.configure({adapter: new Adapter()});

// todo, figure out how to simulate events on the portal
describe('CodeMirror:init', () => {

  let props;
  let mounted;
  const editor = () => {
    if (!mounted) {
      mounted = shallow(
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

describe('CodeMirror: value', () => {

  let props;
  let mounted;
  const editor = () => {
    if (!mounted) {
      mounted = shallow(
        <CodeMirror {...props} />
      );
    }
    return mounted;
  };

  beforeEach(() => {
    props = {
      value: 'foo',
      onSet: (editor, value) => {
        expect.anything(editor);
        expect(value).toBe('foo');
      }
    };
    mounted = undefined;
  });

  it('onSet(editor, value)', () => {
    editor();
  });
});