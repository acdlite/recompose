import React from 'react';
import { expect } from 'chai';
import omit from 'lodash/object/omit';
import { mapPropsOnUpdate, withState, compose } from '../';
import { BaseComponent } from './utils';

import {
  findRenderedComponentWithType,
  renderIntoDocument
} from 'react-addons-test-utils';

describe('mapPropsOnUpdate()', () => {
  it('maps owner props to child props, only when dependent props update', () => {
    const spy = sinon.spy();
    const StringConcat = compose(
      withState('strings', 'updateStrings', ['do', 're', 'mi']),
      withState('foobar', 'updateFoobar', 'foobar'),
      mapPropsOnUpdate('strings', ({ strings, ...rest }) => {
        spy();
        return {
          ...rest,
          string: strings.join('')
        };
      })
    )(BaseComponent);

    expect(StringConcat.displayName).to.equal(
      'withState(withState(mapPropsOnUpdate(BaseComponent)))'
    );

    const tree = renderIntoDocument(<StringConcat />);
    const base = findRenderedComponentWithType(tree, BaseComponent);

    expect(omit(base.props, ['updateStrings', 'updateFoobar'])).to.eql({
      string: 'doremi',
      foobar: 'foobar'
    });
    expect(spy.callCount).to.eql(1);

    // Does not re-map for non-dependent prop updates
    base.props.updateFoobar(() => 'barbaz');
    expect(spy.callCount).to.eql(1);
    expect(omit(base.props, ['updateStrings', 'updateFoobar'])).to.eql({
      string: 'doremi',
      foobar: 'foobar'
    });

    base.props.updateStrings(strings => [...strings, 'fa']);
    expect(omit(base.props, ['updateStrings', 'updateFoobar'])).to.eql({
      string: 'doremifa',
      foobar: 'barbaz'
    });
    expect(spy.callCount).to.eql(2);
  });
});
