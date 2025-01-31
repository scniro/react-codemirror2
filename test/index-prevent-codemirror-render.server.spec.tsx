/**
 * @jest-environment jsdom
 */

global['PREVENT_CODEMIRROR_RENDER'] = true;

import * as React from 'react';
import * as Adapter from 'enzyme-adapter-react-16';
import * as Enzyme from 'enzyme';

import {Controlled, UnControlled} from '../src';

Enzyme.configure({adapter: new Adapter()});

describe('Server Rendering', () => {

  it('should not render', () => {

    let uWrapper = Enzyme.mount(<UnControlled/>);
    let cWrapper = Enzyme.mount(<Controlled value='' onBeforeChange={() => {
    }}/>);

    cWrapper.setProps({value: 'nomatter'});
    uWrapper.setProps({value: 'nomatter'});

    expect(cWrapper.html()).toBeNull();
    expect(uWrapper.html()).toBeNull();

    uWrapper.unmount();
    cWrapper.unmount();
  });
});
