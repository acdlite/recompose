import React from 'react';
import { expect } from 'chai';
import { setDisplayName } from 'recompose';

describe('setDisplayName()', () => {
  it('sets a static property on the base component', () => {
    const BaseComponent = () => <div />;
    const NewComponent = setDisplayName('Foo', BaseComponent);

    expect(NewComponent.displayName).to.eql('Foo');
  });
});
