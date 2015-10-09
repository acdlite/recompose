import React from 'react';
import { expect } from 'chai';
import { withProps } from 'recompose';
import { BaseComponent } from './utils';

import {
  findRenderedComponentWithType,
  renderIntoDocument
} from 'react-addons-test-utils';

describe('withProps()', () => {
  const DoReMi = withProps({ so: 'do', la: 'fa' })(BaseComponent);

  it('passes additional props to base component', () => {
    expect(DoReMi.displayName).to.equal('withProps(BaseComponent)');

    const tree = renderIntoDocument(<DoReMi />);
    const base = findRenderedComponentWithType(tree, BaseComponent);

    expect(base.props).to.eql({ so: 'do', la: 'fa' });
  });

  it('takes precedent over owner props', () => {
    const tree = renderIntoDocument(<DoReMi la="ti" />);
    const base = findRenderedComponentWithType(tree, BaseComponent);

    expect(base.props).to.eql({ so: 'do', la: 'fa' });
  });
});
