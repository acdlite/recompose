import React, { Component, PropTypes } from 'react';
import { expect } from 'chai';
import isStatelessFunctionComponent from '../isStatelessFunctionComponent';

describe('isStatelessFunctionComponent', () => {
  it('returns false for strings', () => {
    expect(isStatelessFunctionComponent('div')).to.be.false;
  });

  it('returns false for class components', () => {
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

    expect(isStatelessFunctionComponent(Foo)).to.be.false;
    expect(isStatelessFunctionComponent(Bar)).to.be.false;
  });

  it('returns true for functions', () => {
    const Foo = props => <div {...props} />;

    expect(isStatelessFunctionComponent(Foo)).to.be.true;
  });

  it('returns false for functions that use context', () => {
    const Foo = (props, context) => <div {...props} {...context} />;
    Foo.contextTypes = { store: PropTypes.object };

    expect(isStatelessFunctionComponent(Foo)).to.be.false;
  });
});
