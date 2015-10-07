import React from 'react';
import { expect } from 'chai';
import { wrapDisplayName } from '../';

describe('wrapDisplayName()', () => {
  it('wraps the display name of a React component with the name of an HoC, Relay-style', () => {
    class SomeComponent extends React.Component {
      render() {
        return <div />;
      }
    }

    expect(wrapDisplayName(SomeComponent, 'someHoC'))
      .to.equal('someHoC(SomeComponent)');
  });
});
