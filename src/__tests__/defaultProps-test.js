import React from 'react';
import { expect } from 'chai';
import { defaultProps, compose, createSpy } from 'recompose';
import { BaseComponent } from './utils';

import { renderIntoDocument } from 'react-addons-test-utils';

describe('defaultProps()', () => {
  const spy = createSpy();
  const DoReMi = compose(
    defaultProps({ so: 'do', la: 'fa' }),
    spy
  )(BaseComponent);

  it('passes additional props to base component', () => {
    expect(DoReMi.displayName)
      .to.equal('defaultProps(spy(BaseComponent))');

    renderIntoDocument(<DoReMi />);

    expect(spy.getProps()).to.eql({ so: 'do', la: 'fa' });
  });

  it('owner props take precendence', () => {
    renderIntoDocument(<DoReMi la="ti" />);

    expect(spy.getProps()).to.eql({ so: 'do', la: 'ti' });
  });

  it('it overrides undefined owner props', () => {
    renderIntoDocument(<DoReMi la={undefined} />);

    expect(spy.getProps()).to.eql({ so: 'do', la: 'fa' });
  });

});
