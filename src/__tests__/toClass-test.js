import React, { PropTypes, Component } from 'react';
import { expect } from 'chai';
import {
  renderIntoDocument,
  findRenderedDOMComponentWithTag
} from 'react-addons-test-utils';
import { shallowRender } from './utils';
import isReactClass from '../isReactClass';
import { toClass } from 'recompose';

describe('toClass()', () => {
  it('returns the component when the component is already a class', () => {
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

    expect(toClass(Foo)).to.eq(Foo);
    expect(toClass(Bar)).to.eq(Bar);
  });

  it('returns a React class when the component is a function', () => {
    const Foo = () => <div />;
    const FooClass = toClass(Foo);

    expect(isReactClass(FooClass)).to.be.true;
    expect(FooClass).to.not.eq(Foo);
  });

  describe('the returned React component class', () => {
    it('takes on the propTypes from the base component', () => {
      const Foo = props => <div {...props} />;
      Foo.propTypes = { foo: PropTypes.object };

      expect(toClass(Foo).propTypes).to.eq(Foo.propTypes);
    });

    it('takes on the defaultProps from the base component', () => {
      const Foo = props => <div {...props} />;
      Foo.defaultProps = { foo: 'bar' };

      expect(toClass(Foo).defaultProps).to.eq(Foo.defaultProps);
    });

    it('takes on the contextTypes from the base component', () => {
      const Foo = () => <div />;
      Foo.contextTypes = { foo: PropTypes.object };

      expect(toClass(Foo).contextTypes).to.eq(Foo.contextTypes);
    });

    it('takes on the displayName from the base component', () => {
      const Foo = () => <div />;

      expect(toClass(Foo).displayName).to.eq('Foo');
    });

    it('renders the base component without altering the markup', () => {
      const Foo = () => <div className="foo" />;
      const FooClass = toClass(Foo);

      require('expect')(shallowRender(<FooClass />))
        .toEqualJSX(shallowRender(<Foo />));
    });

    it('renders the base component, passing through props and context', () => {
      const Foo = (props, context) =>
        <div className={props.baz}>{context.foo}</div>;

      Foo.contextTypes = { foo: PropTypes.string };

      const FooClass = toClass(Foo);

      class FooContext extends Component {
        static childContextTypes = { foo: PropTypes.string };

        getChildContext() {
          return { foo: 'bar' };
        }

        render() {
          return <FooClass baz="qux" />;
        }
      }

      const reactTree = renderIntoDocument(<FooContext />);
      const fooDiv = findRenderedDOMComponentWithTag(reactTree, 'div');

      expect(fooDiv.className).to.eq('qux');
      expect(fooDiv.textContent).to.eq('bar');
    });
  });
});
