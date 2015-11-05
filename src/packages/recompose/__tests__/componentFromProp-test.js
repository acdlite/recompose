import React from 'react';
import { expect } from 'chai';
import { componentFromProp } from 'recompose';
import createSpy from 'recompose/createSpy';

import { renderIntoDocument } from 'react-addons-test-utils';

describe('componentFromProp()', () => {
  it('returns a component takes a component as a prop and renders it with the rest of the props', () => {
    const spy = createSpy();
    const Spy = spy('div');
    const SpyContainer = componentFromProp('component');

    expect(SpyContainer.displayName).to.equal('componentFromProp(component)');

    renderIntoDocument(<SpyContainer component={Spy} pass="through" />);

    expect(spy.getProps()).to.eql({ pass: 'through' });
  });
});
