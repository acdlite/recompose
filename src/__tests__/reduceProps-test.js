import React from 'react';
import { expect } from 'chai';
import omit from 'lodash/object/omit';
import { reduceProps, withState, compose } from 'recompose';
import createSpy from './createSpy';

import { renderIntoDocument } from 'react-addons-test-utils';

describe('reduceProps()', () => {
  it('maps owner props to child props', () => {
    const spy = createSpy();
    const LastNonNullText = compose(
      withState('text', 'setText', null),
      reduceProps((state, props) => ({
        ...props,
        lastNonNullText: !!props.text ? props.text : state.lastNonNullText
      }), {
        lastNonNullText: 'initText'
      }),
      spy
    )('div');

    expect(LastNonNullText.displayName)
      .to.equal('withState(reduceProps(spy(div)))');

    renderIntoDocument(<LastNonNullText />);

    expect(omit(spy.getProps(), ['setText'])).to.eql({
      text: null,
      lastNonNullText: 'initText',
    });

    spy.getProps().setText('Hello');

    expect(omit(spy.getProps(), ['setText'])).to.eql({
      text: 'Hello',
      lastNonNullText: 'Hello',
    });

    spy.getProps().setText(null);

    expect(omit(spy.getProps(), ['setText'])).to.eql({
      text: null,
      lastNonNullText: 'Hello',
    });
  });
});
