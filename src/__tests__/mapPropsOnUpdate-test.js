import React from 'react';
import { expect } from 'chai';
import omit from 'lodash/object/omit';
import { mapPropsOnUpdate, withState, compose, createSpy } from 'recompose';

import { renderIntoDocument } from 'react-addons-test-utils';

describe('mapPropsOnUpdate()', () => {
  it('maps owner props to child props, only when dependent props update', () => {
    const mapSpy = sinon.spy();
    const spy = createSpy();
    const StringConcat = compose(
      withState('strings', 'updateStrings', ['do', 're', 'mi']),
      withState('foobar', 'updateFoobar', 'foobar'),
      mapPropsOnUpdate('strings', ({ strings, ...rest }) => {
        mapSpy();
        return {
          ...rest,
          string: strings.join('')
        };
      }),
      spy
    )('div');

    expect(StringConcat.displayName).to.equal(
      'withState(withState(mapPropsOnUpdate(spy(div))))'
    );

    renderIntoDocument(<StringConcat />);

    expect(omit(spy.getProps(), ['updateStrings', 'updateFoobar'])).to.eql({
      string: 'doremi',
      foobar: 'foobar'
    });
    expect(mapSpy.callCount).to.equal(1);

    // Does not re-map for non-dependent prop updates
    spy.getProps().updateFoobar(() => 'barbaz');
    expect(mapSpy.callCount).to.equal(1);
    expect(omit(spy.getProps(), ['updateStrings', 'updateFoobar'])).to.eql({
      string: 'doremi',
      foobar: 'foobar'
    });

    spy.getProps().updateStrings(strings => [...strings, 'fa']);
    expect(omit(spy.getProps(), ['updateStrings', 'updateFoobar'])).to.eql({
      string: 'doremifa',
      foobar: 'barbaz'
    });
    expect(mapSpy.callCount).to.equal(2);
  });
});
