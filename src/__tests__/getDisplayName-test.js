import React from 'react';
import { expect } from 'chai';
import { getDisplayName } from 'recompose';

describe('getDisplayName()', () => {
  it('gets the display name of a React component', () => {
    class SomeComponent extends React.Component {
      render() {
        return <div />;
      }
    }

    class SomeOtherComponent extends React.Component {
      static displayName = 'CustomDisplayName';
      render() {
        return <div />;
      }
    }

    function YetAnotherComponent() {
      return <div />;
    }

    expect(getDisplayName(SomeComponent)).to.equal('SomeComponent');
    expect(getDisplayName(SomeOtherComponent)).to.equal('CustomDisplayName');
    expect(getDisplayName(YetAnotherComponent)).to.equal('YetAnotherComponent');
    expect(getDisplayName(() => <div />)).to.equal('Component');
  });
});
