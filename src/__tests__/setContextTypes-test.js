import React, { PropTypes } from 'react';
import { expect } from 'chai';
import { setContextTypes } from 'recompose';

describe('setContextTypes()', () => {
  it('sets a static property on the base component', () => {
    const BaseComponent = () => <div />;
    const NewComponent = setContextTypes(
      { foo: PropTypes.object },
      BaseComponent
    );

    expect(NewComponent.contextTypes).to.eql({
      foo: PropTypes.object
    });
  });
});
