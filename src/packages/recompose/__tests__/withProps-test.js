import React from 'react';
import { expect } from 'chai';
import { withProps, compose } from 'recompose';
import createSpy from 'recompose/createSpy';

import { renderIntoDocument } from 'react-addons-test-utils';

describe('withProps()', () => {
  const spy = createSpy();
  const DoReMi = compose(
    withProps({ so: 'do', la: 'fa' }),
    spy
  )('div');

  it('passes additional props to base component', () => {
    expect(DoReMi.displayName).to.equal('withProps(spy(div))');
    renderIntoDocument(<DoReMi />);

    expect(spy.getProps()).to.eql({ so: 'do', la: 'fa' });
  });

  it('takes precedent over owner props', () => {
    renderIntoDocument(<DoReMi la="ti" />);

    expect(spy.getProps()).to.eql({ so: 'do', la: 'fa' });
  });
});
