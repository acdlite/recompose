import React from 'react';
import { expect } from 'chai';
import omit from 'lodash/object/omit';
import { branch, compose, withState, withProps } from 'recompose';
import { BaseComponent } from './utils';

import {
  findRenderedComponentWithType,
  renderIntoDocument
} from 'react-addons-test-utils';

describe('branch()', () => {
  it('tests props and applies one of two HoCs, for true and false', () => {
    const SayMyName = compose(
      withState('isBad', 'updateIsBad', false),
      branch(
        props => props.isBad,
        withProps({ name: 'Heisenberg' }),
        withProps({ name: 'Walter' })
      )
    )(BaseComponent);

    expect(SayMyName.displayName).to.equal(
      'withState(branch(BaseComponent))'
    );

    const tree = renderIntoDocument(<SayMyName pass="through" />);
    let base = findRenderedComponentWithType(tree, BaseComponent);

    expect(omit(base.props, 'updateIsBad')).to.eql({
      isBad: false,
      name: 'Walter',
      pass: 'through'
    });

    base.props.updateIsBad(() => true);
    base = findRenderedComponentWithType(tree, BaseComponent);
    expect(omit(base.props, 'updateIsBad')).to.eql({
      isBad: true,
      name: 'Heisenberg',
      pass: 'through'
    });
  });
});
