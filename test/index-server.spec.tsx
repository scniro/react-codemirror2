import * as React from 'react';
// @ts-ignore
import { renderToString } from 'react-dom/server';

import {Controlled, UnControlled} from '../src';

describe('Server Rendering', () => {

  it('should not render', () => {
    const uWrapper = renderToString(<UnControlled value="nomatter"/>);
    const cWrapper = renderToString(<Controlled value="nomatter" onBeforeChange={() => {}}/>);

    expect(uWrapper).toBe("");
    expect(cWrapper).toBe("");
  });
});
