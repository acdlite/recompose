import React, { Component, PropTypes } from 'react';
import { expect } from 'chai';
import isReferentiallyTransparentFunctionComponent
  from '../isReferentiallyTransparentFunctionComponent';

describe('isReferentiallyTransparentFunctionComponent()', () => {
  it('returns false for strings', () => {
    expect(isReferentiallyTransparentFunctionComponent('div')).to.be.false;
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

    expect(isReferentiallyTransparentFunctionComponent(Foo)).to.be.false;
    expect(isReferentiallyTransparentFunctionComponent(Bar)).to.be.false;
  });

  it('returns true for functions', () => {
    const Foo = props => <div {...props} />;

    expect(isReferentiallyTransparentFunctionComponent(Foo)).to.be.true;
  });

  it('returns false for functions that use context', () => {
    const Foo = (props, context) => <div {...props} {...context} />;
    Foo.contextTypes = { store: PropTypes.object };

    expect(isReferentiallyTransparentFunctionComponent(Foo)).to.be.false;
  });

  it('returns false for functions that use default props', () => {
    const Foo = (props, context) => <div {...props} {...context} />;
    Foo.defaultProps = { store: PropTypes.object };

    expect(isReferentiallyTransparentFunctionComponent(Foo)).to.be.false;
  });

  it('returns false for functions that use propTypes', () => {
    const Foo = (props, context) => <div {...props} {...context} />;
    Foo.propTypes = { store: PropTypes.object };

    expect(isReferentiallyTransparentFunctionComponent(Foo)).to.be.false;
  });
});
