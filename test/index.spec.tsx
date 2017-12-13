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

    let sampleOptions = {lineNumbers: true}

    let uncontrolled = Enzyme.shallow(<UnControlled options={sampleOptions}/>);
    let controlled = Enzyme.shallow(<Controlled options={sampleOptions}/>);

    expect.anything(controlled.html());
    expect.anything(uncontrolled.html());
  });

  it('should unmount', () => {

    let uUnmounted = false;
    let cUnmounted = false;

    let uWrapper = Enzyme.mount(<UnControlled editorWillUnmount={(cm) => {
      uUnmounted = true;
    }}/>);

    let cWrapper = Enzyme.mount(<UnControlled editorWillUnmount={(cm) => {
      cUnmounted = true;
    }}/>);

    uWrapper.unmount();
    cWrapper.unmount();

    expect(uUnmounted).toBeTruthy();
    expect(cUnmounted).toBeTruthy();
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

  it('[Controlled] onChange(editor, event) undo | redo', () => {

    let wrapper = Enzyme.mount(
      <Controlled
        value='foo'
        onBeforeChange={(editor, data, value) => {
          wrapper.setProps({value: value});
        }}/>
    );

    let editor = wrapper.instance().editor;

    editor.replaceRange('bar', {line: 1, ch: 1});
    expect(editor.getValue()).toEqual('foobar');
    editor.undo();
    expect(editor.getValue()).toEqual('foo');
    editor.redo();
    expect(editor.getValue()).toEqual('foobar');
  });

});

describe('Props', () => {

  // <scroll>
  it('[Controlled]: scroll | newProps', () => {

    // todo can't find way to actually invoke a DOM scroll => `onScroll`
    let wrapper = Enzyme.mount(
      <Controlled
        value='foo'
        scroll={{
          x: 50,
          y: 50
        }}
        onScroll={(editor, data) => {
          console.log(data)
        }}/>
    );

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
          console.log(data)
        }}/>
    );

    wrapper.setProps({
      scroll: {
        x: 100,
        y: 100
      }
    });

    wrapper.unmount();
  })
  // </scroll>

  // <selection>
  it('[Controlled, UnControlled]: selection', () => {

    let expected = ['oo'];

    Enzyme.mount(
      <Controlled
        value='foo'
        selection={{
          ranges: [{
            anchor: {ch: 1, line: 0},
            head: {ch: 3, line: 0}
          }]
        }}
        editorDidMount={(editor) => {
          expect(editor.getSelections()).toEqual(expected)
        }}/>
    );

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
          expect(editor.getSelections()).toEqual(expected)
        }}/>
    );
  });

  it('[Controlled, UnControlled]: selection: focus', () => {

    let expected = ['oo'];

    Enzyme.mount(
      <Controlled
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
          expect(editor.getSelections()).toEqual(expected);
        }}/>
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
          expect(editor.getSelections()).toEqual(expected);
        }}/>
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
        onSelection={(editor, data) => {
          expect(data.ranges).toEqual(expectedRanges);
        }}/>
    );

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
        onSelection={(editor, data) => {
          expect(data.ranges).toEqual(expectedRanges);
        }}/>
    );

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

  it('[Controlled: selection | newProps & props', () => {

    let currentRanges = [{
      anchor: {ch: 1, line: 1},
      head: {ch: 2, line: 1}
    }];

    let expectedRanges = [{
      anchor: {ch: 1, line: 1},
      head: {ch: 3, line: 1}
    }];

    let wrapper = Enzyme.mount(
      <Controlled
        value='foo\nbar\nbaz'
        selection={{ranges: currentRanges}}
        editorDidMount={(editor) => {
          expect(editor.doc.sel.ranges).toEqual(currentRanges);
        }}
        onSelection={(editor, data) => {
          expect(data.ranges).toEqual(expectedRanges);
        }}/>
    );

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

  it('[UnControlled: selection | newProps & props', () => {

    let currentRanges = [{
      anchor: {ch: 1, line: 1},
      head: {ch: 2, line: 1}
    }];

    let expectedRanges = [{
      anchor: {ch: 1, line: 1},
      head: {ch: 3, line: 1}
    }];

    let wrapper = Enzyme.mount(
      <UnControlled
        selection={{
          ranges: [{
            anchor: {ch: 1, line: 1},
            head: {ch: 2, line: 1}
          }]
        }}
        value='foo\nbar\nbaz'
        editorDidMount={(editor) => {
          expect(editor.doc.sel.ranges).toEqual(currentRanges);
        }}
        onSelection={(editor, data) => {
          expect(data.ranges).toEqual(expectedRanges);
        }}/>
    );

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
  // </selection>

  // <cursor>
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

  it('[Controlled]: cursor | newProps', () => {

    // todo can't find way to actually invoke a DOM cursor => `onCursor`
    let wrapper = Enzyme.mount(
      <Controlled
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
  })

  it('[Controlled]: cursor | newProps | autoCursor: false', () => {

    // todo can't find way to actually invoke a DOM cursor => `onCursor`
    let wrapper = Enzyme.mount(
      <Controlled
        autoCursor={false}
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
  })
  // </cursor>

  // <misc>
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
  // </misc>
});
