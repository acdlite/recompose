import React from 'react';
import { expect } from 'chai';
import { defaultProps } from '../';
import { BaseComponent } from './utils';

import {
  findRenderedComponentWithType,
  renderIntoDocument
} from 'react-addons-test-utils';

describe('defaultProps()', () => {
  const DoReMi = defaultProps({ so: 'do', la: 'fa' })(BaseComponent);

  it('passes additional props to base component', () => {
    expect(DoReMi.displayName)
      .to.equal('defaultProps(BaseComponent)');

    const tree = renderIntoDocument(<DoReMi />);
    const base = findRenderedComponentWithType(tree, BaseComponent);

    expect(base.props).to.eql({ so: 'do', la: 'fa' });
  });

  it('owner props take precendence', () => {
    const tree = renderIntoDocument(<DoReMi la="ti" />);
    const base = findRenderedComponentWithType(tree, BaseComponent);

    expect(base.props).to.eql({ so: 'do', la: 'ti' });
  });
});
