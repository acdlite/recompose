import React from 'react';
import { expect } from 'chai';
import { setDefaultProps } from 'recompose';

describe('setDefaultProps()', () => {
  it('sets a static property on the base component', () => {
    const BaseComponent = () => <div />;
    const NewComponent = setDefaultProps(
      { foo: 'bar' },
      BaseComponent
    );

    expect(NewComponent.defaultProps).to.eql({
      foo: 'bar'
    });
  });
});
