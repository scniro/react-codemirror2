import * as React from 'react';
import * as Adapter from 'enzyme-adapter-react-16';
import * as Enzyme from 'enzyme';
import * as sinon from 'sinon';

import CodeMirror from '../src';

Enzyme.configure({adapter: new Adapter()});

// todo investigate portal testing with library rendered (codemirror) instance
describe('CodeMirror: init', () => {

  it('should render | props: {}', () => {

    let mounted = Enzyme.shallow(<CodeMirror/>);

    expect.anything(mounted);
    expect.anything(mounted.html())
  });
});

describe('CodeMirror: onSet', () => {

  it('onSet(editor, value)', () => {
    Enzyme.shallow(
      <CodeMirror
        value='foo'
        onSet={(editor, value) => {
          expect.anything(editor);
          expect(value).toBe('foo');
        }}/>
    );
  });
});

describe('CodeMirror: onBeforeSet', () => {

  it('onBeforeSet(editor, value)', () => {

    let callback;

    let wrapper = Enzyme.shallow(
      <CodeMirror
        value='foo'
        onBeforeSet={(editor, next) => {
          callback = sinon.spy(next);
          callback();
        }}
        onSet={(editor, value) => {
          expect.anything(value);
        }}
        editorWillUnmount={(editor) => {
          expect(callback.called).toBe(true);
        }}/>
    );

    wrapper.unmount();
  });
});

describe('CodeMirror: editorWillMount', () => {

  it('editorWillMount(editor, next)', () => {

    let mounted;

    Enzyme.shallow(
      <CodeMirror
        editorWillMount={() => {
          mounted = true;
        }}
        editorDidMount={(editor, next) => {
          expect(mounted).toBe(true);
        }}/>
    );
  });
});

describe('CodeMirror: editorDidConfigure', () => {

  it('editorDidConfigure(editor)', () => {

    let configured, callback;

    let wrapper = Enzyme.shallow(
      <CodeMirror
        editorDidMount={(editor, next) => {
          callback = sinon.spy(next);
          callback();
        }}
        editorDidConfigure={(editor) => {
          configured = true;
        }}
        editorWillUnmount={(editor) => {
          expect(configured).toBe(true);
          expect(callback.called).toBe(true);
        }}/>
    );

    wrapper.unmount();
  });
});