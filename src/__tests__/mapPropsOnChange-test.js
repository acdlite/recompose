import React from 'react';
import { expect } from 'chai';
import omit from 'lodash/object/omit';
import { mapPropsOnChange, withState, compose } from 'recompose';
import createSpy from './createSpy';

import { renderIntoDocument } from 'react-addons-test-utils';

describe('mapPropsOnChange()', () => {
  it('maps owner props to child props, only when dependent props update', () => {
    const mapSpy = sinon.spy();
    const spy = createSpy();
    const StringConcat = compose(
      withState('strings', 'updateStrings', ['do', 're', 'mi']),
      withState('foobar', 'updateFoobar', 'foobar'),
      mapPropsOnChange('strings', ({ strings, ...rest }) => {
        mapSpy();
        return {
          ...rest,
          string: strings.join('')
        };
      }),
      spy
    )('div');

    expect(StringConcat.displayName).to.equal(
      'withState(withState(mapPropsOnChange(spy(div))))'
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
  mapPropsOnChange
});
