import React from 'react';
import { expect } from 'chai';
import omit from 'lodash/object/omit';
import { mapProps, withState, compose } from '../';
import { BaseComponent } from './utils';

import {
  findRenderedComponentWithType,
  renderIntoDocument
} from 'react-addons-test-utils';

describe('mapProps()', () => {
  it('maps owner props to child props', () => {
    const StringConcat = compose(
      withState('strings', 'updateStrings', ['do', 're', 'mi']),
      mapProps(({ strings, ...rest }) => ({
        ...rest,
        string: strings.join('')
      }))
    )(BaseComponent);

    expect(StringConcat.displayName)
      .to.equal('withState(mapProps(BaseComponent))');

    const tree = renderIntoDocument(<StringConcat />);
    const base = findRenderedComponentWithType(tree, BaseComponent);

    expect(omit(base.props, 'updateStrings')).to.eql({
      string: 'doremi'
    });

    base.props.updateStrings(strings => [...strings, 'fa']);
    expect(omit(base.props, 'updateStrings')).to.eql({
      string: 'doremifa'
    });
  });
});
