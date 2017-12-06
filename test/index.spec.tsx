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

    Enzyme.shallow(
      <UnControlled
        editorWillMount={() => {
          this.uMounted = true;
        }}/>
    );

    Enzyme.shallow(
      <Controlled
        editorWillMount={() => {
          this.cMounted = true;
        }}/>
    );

    expect(this.cMounted).toBe(true);
    expect(this.uMounted).toBe(true);
  });
});

describe('[Controlled, UnControlled]: editorDidConfigure', () => {

  it('editorDidConfigure(editor)', () => {

    Enzyme.shallow(
      <UnControlled
        editorDidMount={(editor, value, next) => {
          this.uCallback = sinon.spy(next);
          this.uCallback();
        }}
        editorDidConfigure={(editor) => {
          this.uConfigured = true;
        }}/>
    );

    Enzyme.shallow(
      <Controlled
        editorDidMount={(editor, value, next) => {
          this.cCallback = sinon.spy(next);
          this.cCallback();
        }}
        editorDidConfigure={(editor) => {
          this.cConfigured = true;
        }}/>
    );

    expect(this.uConfigured).toBe(true);
    expect(this.uCallback.called).toBe(true);
    expect(this.cConfigured).toBe(true);
    expect(this.cCallback.called).toBe(true);
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
        }}/>
    );

    wrapper.instance().editor.focus();

    expect(callback.called).toBeTruthy();
  });

  it('onBlur(editor, event)', () => {

    let callback;

    let wrapper = Enzyme.mount(
      <Controlled
        value='foo'
        onBlur={(editor, event) => {
          callback = sinon.spy();
          callback();
        }}/>
    );

    wrapper.instance().editor.focus();
    wrapper.instance().editor.getInputField().blur();
    expect(callback.called).toBeTruthy();
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
        }}/>
    );

    let doc = wrapper.instance().editor.getDoc();
    doc.replaceRange('bar', {line: 1, ch: 1});
    expect(callback.called).toBeTruthy();
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
        }}/>
    );

    let doc = wrapper.instance().editor.getDoc();
    doc.replaceRange('bar', {line: 1, ch: 1});
    expect(callback.called).toBeTruthy();
    expect(beforeCallback.called).toBeTruthy();
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
        }}/>
    );

    let doc = wrapper.instance().editor.getDoc();
    doc.replaceRange('bar', {line: 1, ch: 1});
    expect(callback.called).toBeTruthy();
    expect(beforeCallback.called).toBeTruthy();
  });
});

describe('Props', () => {

  it('[Controlled, UnControlled]: selection | set', () => {

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

  it('[Controlled: selection | dynamic', () => {

    let set = false;

    let expectedRanges = [{
      anchor: {ch: 1, line: 1},
      head: {ch: 3, line: 1}
    }];

    let wrapper = Enzyme.mount(
      <Controlled
        value='foo\nbar\nbaz'
        onSelection={(editor, data) => {

          if (set) {
            expect(data.ranges).toEqual(expectedRanges);
          }

          set = true;
        }}/>
    );

    wrapper.setProps({
      selection: [{
        anchor: {ch: 1, line: 1},
        head: {ch: 3, line: 1}
      }]
    });

    wrapper.unmount();
  });

  it('[UnControlled: selection | dynamic', () => {

    let set = false;

    let expectedRanges = [{
      anchor: {ch: 1, line: 1},
      head: {ch: 3, line: 1}
    }];

    let wrapper = Enzyme.mount(
      <UnControlled
        value='foo\nbar\nbaz'
        onSelection={(editor, data) => {
          expect(data.ranges).toEqual(expectedRanges);
        }}/>
    );

    wrapper.setProps({
      selection: [{
        anchor: {ch: 1, line: 1},
        head: {ch: 3, line: 1}
      }]
    });

    wrapper.unmount();
  });

  it('[Controlled, UnControlled]: cursor | set', () => {

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

    expect(editor.state.focused).toBeTruthy();
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

    expect(editor.state.focused).toBeTruthy();
  });
});
