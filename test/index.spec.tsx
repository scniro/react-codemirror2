/**
 * @jest-environment jsdom
 */

import * as React from 'react';
import * as Adapter from 'enzyme-adapter-react-16';
import * as Enzyme from 'enzyme';
import * as sinon from 'sinon';

import {Controlled, UnControlled} from '../src';

Enzyme.configure({adapter: new Adapter()});

(global as any).console = {
  warn: jest.fn(),
  log: console.log,
  error: console.error
};

(global as any).focus = jest.fn();

// Container for attaching Enzyme mounts to. This is needed for some of the tests
// events to propagate correctly.
let container;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  if (container) container.remove();
});

describe('[Controlled, UnControlled]: init', () => {

  it('should render | props: {}', () => {

    const options = {lineNumbers: true};
    const uncontrolled = Enzyme.shallow(
      <UnControlled
        options={options}
      />);
    const controlled = Enzyme.shallow(
      <Controlled
        value=""
        options={options}
        onBeforeChange={sinon.spy}
      />);
    expect(controlled.html()).not.toBeUndefined();
    expect(uncontrolled.html()).not.toBeUndefined();
  });

  it('should unmount', () => {

    let uUnmounted = false;
    let cUnmounted = false;

    const uWrapper = Enzyme.mount(
      <UnControlled
        editorWillUnmount={cm => {
          uUnmounted = true;
        }}
      />);
    const cWrapper = Enzyme.mount(
      <Controlled
        value=""
        onBeforeChange={sinon.spy}
        editorWillUnmount={cm => {
          cUnmounted = true;
        }}
      />);
    uWrapper.unmount();
    cWrapper.unmount();
    expect(uUnmounted).toBeTruthy();
    expect(cUnmounted).toBeTruthy();
  });

  // refs https://github.com/scniro/react-codemirror2/issues/100
  // prior to 7115754851dde1e1ae90be9f1c1a5e46faecc016 would throw
  it('should allow inputStyle to be set (uses the constructor)', () => {
    let inputStyle = 'contenteditable' as const;
    const options = {inputStyle};
    Enzyme.shallow(
      <UnControlled
        options={options}
        editorDidMount={(editor, value, next) => {
          expect(editor.getInputField().tagName).toBe('DIV');
        }}
      />);
    Enzyme.shallow(
      <Controlled
        value=""
        options={options}
        onBeforeChange={sinon.spy}
        editorDidMount={(editor, value, next) => {
          expect(editor.getInputField().tagName).toBe('DIV');
        }}
      />);
  });

  it('should append a class name', () => {

    const uWrapper = Enzyme.mount(
      <UnControlled
        className={'class-uncontrolled'}
      />);
    const cWrapper = Enzyme.mount(
      <Controlled
        className={'class-controlled'}
        value=""
        onBeforeChange={sinon.spy}
      />);
    expect(/react-codemirror2 class-uncontrolled/g.test(uWrapper.html())).toBeTruthy();
    expect(/react-codemirror2 class-controlled/g.test(cWrapper.html())).toBeTruthy();
  });
});

describe('[Controlled, UnControlled]: editorDidConfigure', () => {

  it('editorDidConfigure(editor)', () => {
    let uCallback;
    let uConfigured;
    let cCallback;
    let cConfigured;

    Enzyme.shallow(
      <UnControlled
        editorDidMount={(editor, value, next) => {
          uCallback = sinon.spy(next);
          uCallback();
        }}
        editorDidConfigure={editor => {
          uConfigured = true;
        }}
      />);

    Enzyme.shallow(
      <Controlled
        value=""
        onBeforeChange={sinon.spy}
        editorDidMount={(editor, value, next) => {
          cCallback = sinon.spy(next);
          cCallback();
        }}
        editorDidConfigure={editor => {
          cConfigured = true;
        }}
      />);

    expect(uConfigured).toBe(true);
    expect(uCallback.called).toBe(true);
    expect(cConfigured).toBe(true);
    expect(cCallback.called).toBe(true);
  });
});

describe('[Controlled, UnControlled]: defineMode', () => {

  it('defineMode', () => {

    let mode: any = {
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
        editorDidMount={(editor, value, next) => {
          expect(editor.getDoc().getMode().name).toBe('testMode');
        }}/>
    );

    let cWrapper = Enzyme.shallow(
      <Controlled
        value=""
        onBeforeChange={sinon.spy}
        defineMode={mode}
        editorDidMount={(editor, value, next) => {
          expect(editor.getDoc().getMode().name).toBe('testMode');
        }}/>
    );

    cWrapper.unmount();
    uWrapper.unmount();
  });
});

describe('DOM Events', () => {

  it('[Controlled] onFocus', done => {

    let onFocus = false;

    const wrapper = Enzyme.mount(
      <Controlled
        value='foo'
        onBeforeChange={sinon.spy}
        onFocus={() => {
          onFocus = true;
          wrapper.unmount();
        }}
        editorWillUnmount={cm => {
          expect(onFocus).toBeTruthy();
          done();
        }}
      />,
      { attachTo: container }
    );
    wrapper.instance().editor.focus();
  });

  it('[UnControlled] onFocus', done => {

    let onFocus = false;

    const wrapper = Enzyme.mount(
      <UnControlled
        value='foo'
        onFocus={() => {
          onFocus = true;
          wrapper.unmount();
        }}
        editorWillUnmount={cm => {
          expect(onFocus).toBeTruthy();
          done();
        }}
      />,
      { attachTo: container }
    );
    wrapper.instance().editor.focus();
  });

  it('[Controlled] onBlur', done => {

    let onBlur = false;

    const wrapper = Enzyme.mount(
      <Controlled
        value='foo'
        onBeforeChange={sinon.spy}
        onBlur={() => {
          onBlur = true;
          wrapper.unmount();
        }}
        editorWillUnmount={cm => {
          expect(onBlur).toBeTruthy();
          done();
        }}
      />,
      { attachTo: container }
    );
    wrapper.instance().editor.focus();
    wrapper.instance().editor.getInputField().blur();
  });

  it('[UnControlled] onBlur', done => {

    let onBlur = false;

    const wrapper = Enzyme.mount(
      <UnControlled
        value='foo'
        onBlur={() => {
          onBlur = true;
          wrapper.unmount();
        }}
        editorWillUnmount={cm => {
          expect(onBlur).toBeTruthy();
          done();
        }}
      />,
      { attachTo: container }
    );
    wrapper.instance().editor.focus();
    wrapper.instance().editor.getInputField().blur();
  });
});

describe('Change', () => {

  it('[Controlled] change:onChange', done => {
    const wrapper = Enzyme.mount(
      <Controlled
        value='foo'
        onBeforeChange={(editor, data, value) => {
          wrapper.setProps({value});
        }}
        onChange={(editor, data, value) => {
          expect(value).toEqual('foobar');
          expect(editor.getValue()).toEqual('foobar');
          done();
        }}
      />);
    const doc = wrapper.instance().editor.getDoc();
    doc.replaceRange('bar', {line: 1, ch: 1});
  });

  it('[Controlled] change:onRenderLine', done => {
    const wrapper = Enzyme.mount(
      <Controlled
        value='foo'
        onBeforeChange={(editor, data, value) => {
          wrapper.setProps({value});
        }}
        onRenderLine={(editor, line, element) => {
          expect(line.text).toEqual('foobar');
          expect(element).toBeDefined();
          expect(editor.getValue()).toEqual('foobar');
          done();
        }}
      />);
    const doc = wrapper.instance().editor.getDoc();
    doc.replaceRange('bar', {line: 1, ch: 1});
  });

  it('[Controlled] change:undo|redo', done => {

    let n = 0;

    const wrapper = Enzyme.mount(
      <Controlled
        value='foo'
        onBeforeChange={(editor, data, value) => {
          wrapper.setProps({value});
        }}
        onChange={(editor, data, value) => {
          const doc = editor.getDoc();
          n += 1;
          switch (n) {
            case 1:
              expect(editor.getValue()).toEqual('foobar');
              doc.undo();
              break;
            case 2:
              expect(editor.getValue()).toEqual('foo');
              doc.redo();
              break;
            case 3:
              expect(value).toEqual('foobar');
              done();
              break;
          }
        }}
      />);
    const doc = wrapper.instance().editor.getDoc();
    doc.replaceRange('bar', {line: 1, ch: 1});
  });

  it('[UnControlled] change:onChange', done => {
    const wrapper = Enzyme.mount(
      <UnControlled
        value='foo'
        onChange={(editor, data, value) => {
          expect(value).toEqual('foobar');
          expect(editor.getValue()).toEqual('foobar');
          done();
        }}
      />);
    const doc = wrapper.instance().editor.getDoc();
    doc.replaceRange('bar', {line: 1, ch: 1});
  });

  it('[UnControlled] change:onRenderLine', done => {
    const wrapper = Enzyme.mount(
      <UnControlled
        value='foo'
        onRenderLine={(editor, line, element) => {
          expect(line.text).toEqual('foobar');
          expect(element).toBeDefined();
          expect(editor.getValue()).toEqual('foobar');
          done();
        }}
      />);
    const doc = wrapper.instance().editor.getDoc();
    doc.replaceRange('bar', {line: 1, ch: 1});
  });

  it('[Controlled] change:undo|redo', done => {

    let n = 0;

    const wrapper = Enzyme.mount(
      <UnControlled
        value='foo'
        onChange={(editor, data, value) => {
          const doc = editor.getDoc();
          n += 1;
          switch (n) {
            case 1:
              expect(editor.getValue()).toEqual('foobar');
              doc.undo();
              break;
            case 2:
              expect(editor.getValue()).toEqual('foo');
              doc.redo();
              break;
            case 3:
              expect(value).toEqual('foobar');
              done();
              break;
          }
        }}
      />);
    const doc = wrapper.instance().editor.getDoc();
    doc.replaceRange('bar', {line: 1, ch: 1});
  });

  it('[Controlled] transform value', done => {
    // For some reason, onChange callback started firing twice after bumping JSDOM + Jest
    // setup. There were no changes to either react-codemirror2 or the version of codemirror
    // installed at the time, so we're going to just ignore that second onChange as some
    // artifact of the test environemtn for now.
    let isDone = false;

    const wrapper = Enzyme.mount(
      <Controlled
        value='foo'
        onBeforeChange={(editor, data, value) => {
          wrapper.setProps({value: value.replace(/o/g, 'p')});
        }}
        onChange={(editor, data, value) => {
          if (isDone) return;
          expect(value).toEqual('fppfpp');
          expect(editor.getValue()).toEqual('fppfpp');
          isDone = true;
          done();
        }}
      />);
    const doc = wrapper.instance().editor.getDoc();
    doc.replaceRange('foo', {line: 1, ch: 1});
  });
});

describe('Props', () => {

  it('[Controlled]: scroll | newProps', () => {

    // todo can't find way to actually invoke a DOM scroll => `onScroll`
    let wrapper = Enzyme.mount(
      <Controlled
        value='foo'
        onBeforeChange={sinon.spy}
        scroll={{
          x: 50,
          y: 50
        }}
        onScroll={(editor, data) => {
          //
        }}
      />);

    wrapper.setProps({
      scroll: {
        x: 100,
        y: 100
      }
    });

    wrapper.unmount();
  });

  it('[UnControlled]: scroll | newProps', () => {

    // todo can't find way to actually invoke a DOM scroll => `onScroll`
    let wrapper = Enzyme.mount(
      <UnControlled
        value='foo'
        scroll={{
          x: 50,
          y: 50
        }}
        onScroll={(editor, data) => {
          //console.log(data)
        }}
      />);

    wrapper.setProps({
      scroll: {
        x: 100,
        y: 100
      }
    });

    wrapper.unmount();
  });

  it('[Controlled, UnControlled]: selection', () => {

    let expected = ['oo'];

    Enzyme.mount(
      <Controlled
        value="foo"
        onBeforeChange={sinon.spy}
        selection={{
          ranges: [{
            anchor: {ch: 1, line: 0},
            head: {ch: 3, line: 0}
          }]
        }}
        editorDidMount={(editor) => {
          expect(editor.getDoc().getSelections()).toEqual(expected)
        }}
      />);

    Enzyme.mount(
      <UnControlled
        value='foo'
        selection={{
          ranges: [{
            anchor: {ch: 1, line: 0},
            head: {ch: 3, line: 0}
          }]
        }}
        editorDidMount={(editor) => {
          expect(editor.getDoc().getSelections()).toEqual(expected)
        }}
      />);
  });

  it('[Controlled, UnControlled]: selection: focus', () => {

    let expected = ['oo'];

    Enzyme.mount(
      <Controlled
        value="foo"
        onBeforeChange={sinon.spy}
        selection={{
          focus: true,
          ranges: [{
            anchor: {ch: 1, line: 0},
            head: {ch: 3, line: 0}
          }]
        }}
        editorDidMount={(editor) => {
          expect(editor.state.focused).toBeTruthy();
          expect(editor.getDoc().getSelections()).toEqual(expected);
        }}
      />,
      { attachTo: container }
    );

    Enzyme.mount(
      <UnControlled
        value='foo'
        selection={{
          focus: true,
          ranges: [{
            anchor: {ch: 1, line: 0},
            head: {ch: 3, line: 0}
          }]
        }}
        editorDidMount={(editor) => {
          expect(editor.state.focused).toBeTruthy();
          expect(editor.getDoc().getSelections()).toEqual(expected);
        }}
      />,
      { attachTo: container }
    );
  });

  it('[Controlled: selection | newProps', () => {

    let expectedRanges = [{
      anchor: {ch: 1, line: 1},
      head: {ch: 3, line: 1}
    }];

    let wrapper = Enzyme.mount(
      <Controlled
        value='foo\nbar\nbaz'
        onBeforeChange={sinon.spy}
        onSelection={(editor) => {
          expect(editor.getDoc().getSelection()).toEqual(expectedRanges);
        }}
      />);

    wrapper.setProps({
      selection: {
        ranges: [{
          anchor: {ch: 1, line: 1},
          head: {ch: 3, line: 1}
        }]
      }
    });

    wrapper.unmount();
  });

  it('[UnControlled: selection | newProps', () => {

    let expectedRanges = [{
      anchor: {ch: 1, line: 1},
      head: {ch: 3, line: 1}
    }];

    let wrapper = Enzyme.mount(
      <UnControlled
        value='foo\nbar\nbaz'
        onSelection={(editor) => {
          expect(editor.getDoc().getSelection()).toEqual(expectedRanges);
        }}
      />);

    wrapper.setProps({
      selection: {
        ranges: [{
          anchor: {ch: 1, line: 1},
          head: {ch: 3, line: 1}
        }]
      }
    });

    wrapper.unmount();
  });

  it('[Controlled, UnControlled]: cursor', () => {

    Enzyme.mount(
      <Controlled
        value='foo'
        onBeforeChange={sinon.spy}
        cursor={{
          line: 0,
          ch: 3
        }}
        onSelection={(editor) => {
          expect(editor.getDoc().getCursor()).not.toBeNull()
        }}/>
    );

    Enzyme.mount(
      <UnControlled
        value='foo'
        cursor={{
          line: 0,
          ch: 3
        }}
        onSelection={(editor) => {
          expect(editor.getDoc().getCursor()).not.toBeNull()
        }}/>
    );
  });

  it('[Controlled]: cursor | newProps', () => {

    // todo can't find way to actually invoke a DOM cursor => `onCursor`
    let wrapper = Enzyme.mount(
      <Controlled
        value='foo'
        onBeforeChange={sinon.spy}
        onCursor={(editor, data) => {
          console.log('oncursor')
        }}/>
    );

    wrapper.setProps({
      cursor: {
        line: 1,
        ch: 2
      }
    });

    wrapper.unmount();
  });

  it('[UnControlled]: cursor | newProps', () => {

    // todo can't find way to actually invoke a DOM cursor => `onCursor`
    let wrapper = Enzyme.mount(
      <UnControlled
        value='foo'
        onCursor={(editor, data) => {
          console.log('oncursor')
        }}/>
    );

    wrapper.setProps({
      cursor: {
        line: 1,
        ch: 2
      }
    });

    wrapper.unmount();
  });

  it('[Controlled]: cursor | newProps & props', () => {

    // todo can't find way to actually invoke a DOM cursor => `onCursor`
    let wrapper = Enzyme.mount(
      <Controlled
        value='foo'
        onBeforeChange={sinon.spy}
        cursor={{
          line: 1,
          ch: 1
        }}
        onCursor={(editor, data) => {
          console.log('oncursor')
        }}/>
    );

    wrapper.setProps({
      cursor: {
        line: 1,
        ch: 2
      }
    });

    wrapper.unmount();
  });

  it('[UnControlled]: cursor | newProps & props', () => {

    // todo can't find way to actually invoke a DOM cursor => `onCursor`
    let wrapper = Enzyme.mount(
      <UnControlled
        value='foo'
        cursor={{
          line: 1,
          ch: 1
        }}
        onCursor={(editor, data) => {
          console.log('oncursor')
        }}/>
    );

    wrapper.setProps({
      cursor: {
        line: 1,
        ch: 2
      }
    });

    wrapper.unmount();
  });

  it('[Controlled]: cursor | newProps | autoCursor: false', () => {

    // todo can't find way to actually invoke a DOM cursor => `onCursor`
    let wrapper = Enzyme.mount(
      <Controlled
        autoCursor={false}
        value='foo'
        onBeforeChange={sinon.spy}
        cursor={{
          line: 1,
          ch: 1
        }}
        onCursor={(editor, data) => {
          // todo
        }}/>
    );

    wrapper.setProps({
      cursor: {
        line: 1,
        ch: 2
      }
    });

    wrapper.unmount();
  });

  it('[UnControlled]: cursor | newProps | autoCursor: false', () => {

    // todo can't find way to actually invoke a DOM cursor => `onCursor`
    let wrapper = Enzyme.mount(
      <UnControlled
        autoCursor={false}
        value='foo'
        cursor={{
          line: 1,
          ch: 1
        }}
        onCursor={(editor, data) => {
          // todo
        }}/>
    );

    wrapper.setProps({
      cursor: {
        line: 1,
        ch: 2
      }
    });

    wrapper.unmount();
  });

  it('[Controlled]: cursor | newProps | autoCursor: true', () => {

    // todo can't find way to actually invoke a DOM cursor => `onCursor`
    let wrapper = Enzyme.mount(
      <Controlled
        value='foo'
        onBeforeChange={sinon.spy}
        cursor={{
          line: 1,
          ch: 1
        }}
        onCursor={(editor, data) => {
          // todo
        }}/>
    );

    wrapper.setProps({
      cursor: {
        line: 1,
        ch: 2
      }
    });

    wrapper.unmount();
  });

  it('[UnControlled]: cursor | newProps | autoCursor: true', () => {

    // todo can't find way to actually invoke a DOM cursor => `onCursor`
    let wrapper = Enzyme.mount(
      <UnControlled
        value='foo'
        cursor={{
          line: 1,
          ch: 1
        }}
        onCursor={(editor, data) => {
          // todo
        }}/>
    );

    wrapper.setProps({
      cursor: {
        line: 1,
        ch: 2
      }
    });

    wrapper.unmount();
  });

  it('[Controlled]: cursor | newProps | autoCursor: true, autoScroll: true', () => {

    // todo can't find way to actually invoke a DOM cursor => `onCursor`
    let wrapper = Enzyme.mount(
      <Controlled
        value='foo'
        onBeforeChange={sinon.spy}
        autoScroll={true}
        cursor={{
          line: 1,
          ch: 1
        }}
        onCursor={(editor, data) => {
          // todo
        }}/>
    );

    wrapper.setProps({
      cursor: {
        line: 1,
        ch: 2
      }
    });

    wrapper.unmount();
  });

  it('[UnControlled]: cursor | newProps | autoCursor: true, autoScroll: true', () => {

    // todo can't find way to actually invoke a DOM cursor => `onCursor`
    let wrapper = Enzyme.mount(
      <UnControlled
        value='foo'
        autoScroll={true}
        cursor={{
          line: 1,
          ch: 1
        }}
        onCursor={(editor, data) => {
          // todo
        }}/>
    );

    wrapper.setProps({
      cursor: {
        line: 1,
        ch: 2
      }
    });

    wrapper.unmount();
  });

  it('[UnControlled]: new value | invoke apply pipeline accordingly`', () => {
    let wrapper = Enzyme.mount(
      <UnControlled
        value='foo'
        onChange={(editor, data) => {
        }}/>
    );

    expect(wrapper.instance().appliedUserDefined).toBeFalsy();

    wrapper.setProps({
      value: 'bar'
    });

    expect(wrapper.instance().appliedUserDefined).toBeTruthy();

    wrapper.unmount();
  });

  it('[Controlled]: new value | invoke apply pipeline accordingly`', () => {
    let wrapper = Enzyme.mount(
      <Controlled
        value='foo'
        onBeforeChange={sinon.spy}
        onChange={(editor, data) => {
        }}/>
    );

    expect(wrapper.instance().applied).toBeTruthy();
    expect(wrapper.instance().appliedUserDefined).toBeFalsy();
    expect(wrapper.instance().appliedNext).toBeFalsy();

    wrapper.setProps({
      value: 'bar'
    });

    expect(wrapper.instance().appliedUserDefined).toBeTruthy();
    expect(wrapper.instance().appliedNext).toBeTruthy();

    wrapper.unmount();
  });

  it('[UnControlled]: detached | should detach', () => {
    const spy = sinon.spy();
    const wrapper = Enzyme.mount(
      <UnControlled detach={false} editorDidDetach={() => spy()}/>
    );

    expect(spy.called).toBeFalsy();
    wrapper.setProps({detach: true});
    expect(spy.called).toBeTruthy();
    wrapper.unmount();
  });

  it('[UnControlled]: detached | should attach', () => {
    const spy = sinon.spy();
    const wrapper = Enzyme.mount(
      <UnControlled detach={true} editorDidAttach={() => spy()}/>
    );

    expect(spy.called).toBeFalsy();
    wrapper.setProps({detach: false});
    expect(spy.called).toBeTruthy();
    wrapper.unmount();
  });

  it('[UnControlled]: detached:false | should update', done => {
    let instance;
    const spy = sinon.spy();
    const wrapper = Enzyme.mount(
      <UnControlled
        editorDidMount={editor => instance = editor}/>
    );

    instance.on('optionChange', () => spy());

    wrapper.setProps({options: {lineNumbers: true}});

    // force lose `.on` race
    setTimeout(() => {
      expect(spy.called).toBeTruthy();
      wrapper.unmount();
      done();
    }, 200);
  });

  it('[UnControlled]: detached:false | should *not* update | on mount', done => {
    let instance;
    const spy = sinon.spy();
    const wrapper = Enzyme.mount(
      <UnControlled
        detach={true}
        editorDidMount={editor => instance = editor}/>
    );

    instance.on('optionChange', () => spy());

    wrapper.setProps({options: {lineNumbers: true}});

    // force lose `.on` race
    setTimeout(() => {
      expect(spy.called).toBeFalsy();
      wrapper.unmount();
      done();
    }, 200);
  });

  it('[UnControlled]: detached:false | should *not* update | on props', done => {
    let instance;
    const spy = sinon.spy();
    const wrapper = Enzyme.mount(
      <UnControlled
        editorDidMount={editor => instance = editor}/>
    );

    instance.on('optionChange', () => spy());

    wrapper.setProps({detach: true, options: {lineNumbers: true}});

    // force lose `.on` race
    setTimeout(() => {
      expect(instance.getOption('lineNumbers')).toBeFalsy();
      wrapper.unmount();
      done();
    }, 200);
  });

  it('[Controlled: selection | newProps & props', done => {

    const currentRanges = [{
      anchor: {ch: 1, line: 0},
      head: {ch: 2, line: 0}
    }];

    const expectedRanges = [{
      anchor: {ch: 1, line: 0},
      head: {ch: 3, line: 0}
    }];

    const wrapper = Enzyme.mount(
      <Controlled
        value='foobar'
        onBeforeChange={sinon.spy}
        selection={{ranges: currentRanges}}
        onSelection={(editor, data) => {
          expect(data.ranges).toEqual(expectedRanges);
          done();
        }}/>
    );

    wrapper.setProps({
      selection: {
        ranges: [{
          anchor: {ch: 1, line: 0},
          head: {ch: 3, line: 0}
        }]
      }
    });

    wrapper.unmount();
  });
});
