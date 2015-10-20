import React from 'react';
import { expect } from 'chai';
import omit from 'lodash/object/omit';
import { branch, compose, withState, withProps } from 'recompose';
import createSpy from './createSpy';

import { renderIntoDocument } from 'react-addons-test-utils';

describe('branch()', () => {
  it('tests props and applies one of two HoCs, for true and false', () => {
    const spy = createSpy();

    const SayMyName = compose(
      withState('isBad', 'updateIsBad', false),
      branch(
        props => props.isBad,
        withProps({ name: 'Heisenberg' }),
        withProps({ name: 'Walter' })
      ),
      spy
    )('div');

    expect(SayMyName.displayName).to.equal(
      'withState(branch(spy(div)))'
    );

    renderIntoDocument(<SayMyName pass="through" />);

    expect(omit(spy.getProps(), 'updateIsBad')).to.eql({
      isBad: false,
      name: 'Walter',
      pass: 'through'
    });

    spy.getProps().updateIsBad(() => true);
    expect(omit(spy.getProps(), 'updateIsBad')).to.eql({
      isBad: true,
      name: 'Heisenberg',
      pass: 'through'
    });
  });
});
