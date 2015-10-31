import React, { Component } from 'react';
import { expect } from 'chai';
import isClassComponent from '../isClassComponent';

describe('isClassComponent()', () => {
  it('returns false for functions', () => {
    const Foo = () => <div />;

    expect(isClassComponent(Foo)).to.be.false;
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

    expect(isClassComponent(Foo)).to.be.true;
    expect(isClassComponent(Bar)).to.be.true;
  });
});
