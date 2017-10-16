import * as React from 'react';
import * as Adapter from 'enzyme-adapter-react-16';
import * as Enzyme from 'enzyme';
import * as sinon from 'sinon';

import {Controlled, UnControlled} from '../src';

Enzyme.configure({adapter: new Adapter()});

describe('[Controlled, UnControlled]: init', () => {

  it('should render | props: {}', () => {

    let uncontrolled = Enzyme.shallow(<UnControlled/>);
    let controlled = Enzyme.shallow(<Controlled/>);

    expect.anything(controlled.html());
    expect.anything(uncontrolled.html());
  });
});

describe('[Controlled, UnControlled]: editorWillMount', () => {

  it('editorWillMount(editor, next)', () => {

    let uMounted, cMounted;

    Enzyme.shallow(
      <UnControlled
        editorWillMount={() => {
          uMounted = true;
        }}
        editorDidMount={(editor, next) => {
          expect(uMounted).toBe(true);
        }}/>
    );

    Enzyme.shallow(
      <Controlled
        editorWillMount={() => {
          cMounted = true;
        }}
        editorDidMount={(editor, next) => {
          expect(cMounted).toBe(true);
        }}/>
    );
  });
});

describe('[Controlled, UnControlled]: editorDidConfigure', () => {

  it('editorDidConfigure(editor)', () => {

    let uConfigured, uCallback, cContigured, cCallback;

    let uWrapper = Enzyme.shallow(
      <UnControlled
        editorDidMount={(editor, value, next) => {
          uCallback = sinon.spy(next);
          uCallback();
        }}
        editorDidConfigure={(editor) => {
          uConfigured = true;
        }}
        editorWillUnmount={(editor) => {
          expect(uConfigured).toBe(true);
          expect(uCallback.called).toBe(true);
        }}/>
    );

    let cWrapper = Enzyme.shallow(
      <Controlled
        editorDidMount={(editor, value, next) => {
          uCallback = sinon.spy(next);
          uCallback();
        }}
        editorDidConfigure={(editor) => {
          uConfigured = true;
        }}
        editorWillUnmount={(editor) => {
          expect(uConfigured).toBe(true);
          expect(uCallback.called).toBe(true);
        }}/>
    );

    uWrapper.unmount();
    cWrapper.unmount();
  });
});

describe('[Controlled, UnControlled]: defineMode', () => {

  it('defineMode', () => {

    let mode = {
      name: 'testMode',
      fn: () => {
        return {
          startState: () => {
          },
          token: (stream, state) => {
            stream.next();
          }
        }
      }
    };

    let uWrapper = Enzyme.shallow(
      <UnControlled
        defineMode={mode}
        editorDidMount={(editor, next) => {
          expect(editor.doc.mode.name).toBe('testMode');
        }}/>
    );

    let cWrapper = Enzyme.shallow(
      <Controlled
        defineMode={mode}
        editorDidMount={(editor, next) => {
          expect(editor.doc.mode.name).toBe('testMode');
        }}/>
    );

    cWrapper.unmount();
    uWrapper.unmount();
  });
});

describe('UnControlled: onChange', () => {

  it('onChange(editor, value)', () => {
    Enzyme.shallow(
      <UnControlled
        value='foo'
        onChange={(editor, value) => {
          expect.anything(editor);
          expect(value).toBe('foo');
        }}/>
    );
  });
});

describe('UnControlled: onBeforeChange', () => {

  it('onBeforeChange(editor, value)', () => {

    let callback;

    let wrapper = Enzyme.shallow(
      <UnControlled
        value='foo'
        onBeforeChange={(editor, data, value, next) => {
          callback = sinon.spy(next);
          callback();
        }}
        onChange={(editor, value) => {
          expect.anything(value);
        }}
        editorWillUnmount={(editor) => {
          expect(callback.called).toBe(true);
        }}/>
    );

    wrapper.unmount();
  });
});