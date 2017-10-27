import * as React from 'react';
import * as Adapter from 'enzyme-adapter-react-16';
import * as Enzyme from 'enzyme';
import * as sinon from 'sinon';

import {Controlled, UnControlled} from '../src';

Enzyme.configure({adapter: new Adapter()});

global.console = {
  warn: jest.fn(),
  log: console.log
};

describe('[temporary] deprecation notice', () => {

  Enzyme.shallow(<UnControlled
    autoScrollCursorOnSet={true}
    resetCursorOnSet={true}
    onSet={() => {
    }}
    onBeforeSet={() => {
    }}/>
  );

  expect(global.console.warn).toHaveBeenCalled()
});

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

describe('DOM Events', () => {

  it('onFocus(editor, event)', () => {

    let callback;

    let wrapper = Enzyme.mount(
      <Controlled
        value='foo'
        onFocus={() => {
          callback = sinon.spy();
          callback();
        }}
        editorWillUnmount={(editor) => {
          expect(callback.called).toBe(true);
        }}/>
    );

    wrapper.instance().editor.focus();

    wrapper.unmount();
  });

  it('onBlur(editor, event)', () => {

    let callback;

    let wrapper = Enzyme.mount(
      <Controlled
        value='foo'
        onBlur={(editor, event) => {
          callback = sinon.spy();
          callback();
        }}
        editorWillUnmount={(editor) => {
          expect(callback.called).toBe(true);
        }}/>
    );

    wrapper.instance().editor.focus();
    wrapper.instance().editor.getInputField().blur();
    wrapper.unmount();
  });
});

describe('Change', () => {

  it('[UnControlled] onChange(editor, event)', () => {

    let callback;

    let wrapper = Enzyme.mount(
      <UnControlled
        value='foo'
        onChange={(editor, data, value) => {
          callback = sinon.spy();
          callback();
        }}
        editorWillUnmount={(editor) => {
          expect(callback.called).toBe(true);
        }}/>
    );

    let doc = wrapper.instance().editor.getDoc();

    doc.replaceRange('bar', {line: 1, ch: 1});

    wrapper.unmount();
  });

  it('[UnControlled] onBeforeChange(editor, event)', () => {

    let callback, beforeCallback;

    let wrapper = Enzyme.mount(
      <UnControlled
        value='foo'
        onBeforeChange={(editor, data, value, next) => {
          beforeCallback = sinon.spy(next);
          beforeCallback();
        }}
        onChange={(editor, data, value) => {
          callback = sinon.spy();
          callback();
        }}
        editorWillUnmount={(editor) => {
          expect(callback.called).toBe(true);
          expect(beforeCallback.called).toBe(true);
        }}/>
    );

    let doc = wrapper.instance().editor.getDoc();

    doc.replaceRange('bar', {line: 1, ch: 1});

    wrapper.unmount();
  });

  it('[Controlled] onChange(editor, event)', () => {

    let callback, beforeCallback;

    let wrapper = Enzyme.mount(
      <Controlled
        value='foo'
        onBeforeChange={(editor, data, value) => {
          beforeCallback = sinon.spy();
          beforeCallback();
          wrapper.setProps({value: 'foobar'});
        }}
        onChange={(editor, data, value) => {
          callback = sinon.spy();
          callback();
        }}
        editorWillUnmount={(editor) => {
          expect(callback.called).toBe(true);
          expect(beforeCallback.called).toBe(true);
        }}/>
    );

    let doc = wrapper.instance().editor.getDoc();

    doc.replaceRange('bar', {line: 1, ch: 1});

    wrapper.unmount();
  });
});

describe('Props', () => {

  it('[Controlled, UnControlled]: selection', () => {

    Enzyme.mount(
      <Controlled
        value='foo'
        selection={[{
          anchor: {ch: 1, line: 0},
          head: {ch: 3, line: 0}
        }]}
        onSelection={(editor, data) => {
          expect.anything(data.ranges)
        }}/>
    );

    Enzyme.mount(
      <UnControlled
        value='foo'
        selection={[{
          anchor: {ch: 1, line: 0},
          head: {ch: 3, line: 0}
        }]}
        onSelection={(editor, data) => {
          expect.anything(data.ranges)
        }}/>
    );
  });

  it('[Controlled, UnControlled]: cursor', () => {

    Enzyme.mount(
      <Controlled
        value='foo'
        cursor={{
          line: 0,
          ch: 3
        }}
        onSelection={(editor, data) => {
          expect.anything(data.ranges)
        }}/>
    );

    Enzyme.mount(
      <UnControlled
        value='foo'
        cursor={{
          line: 0,
          ch: 3
        }}
        onSelection={(editor, data) => {
          expect.anything(data.ranges)
        }}/>
    );
  });

  it('[Controlled]: autoFocus', () => {
    let wrapper = Enzyme.mount(
      <Controlled
        value='foo'
        autoFocus={true}
        cursor={{
          line: 0,
          ch: 3
        }}/>
    );

    let editor = wrapper.instance().editor;

    expect(editor.state.focused).toBe(true)
  });

  it('[UnControlled]: autoFocus', () => {
    let wrapper = Enzyme.mount(
      <UnControlled
        value='foo'
        autoFocus={true}
        cursor={{
          line: 0,
          ch: 3
        }}/>
    );

    let editor = wrapper.instance().editor;

    expect(editor.state.focused).toBe(true)
  });
});
