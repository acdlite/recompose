import React, { Component } from 'react';
import { expect } from 'chai';
import isReactClass from '../isReactClass';

describe('isReactClass()', () => {
  it('returns false for functions', () => {
    const Foo = () => <div />;

    expect(isReactClass(Foo)).to.be.false;
  });

  it('returns true for React component classes', () => {
    class Foo extends Component {
      render() {
        return <div />;
      }
    }

    const Bar = React.createClass({
      render() {
        return <div />;
      }
    });

    expect(isReactClass(Foo)).to.be.true;
    expect(isReactClass(Bar)).to.be.true;
  });
});
