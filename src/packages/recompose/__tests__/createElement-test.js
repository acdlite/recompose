import React, { Component } from 'react';
import expect from 'expect';
import createElement from '../createElement';

import { createRenderer } from 'react-addons-test-utils';

/**
 * These tests use the shallow renderer to inspect the React elements that
 * are owned by a component.
 */
describe('createElement()', () => {
  it('treats class components normally', () => {
    const renderer = createRenderer();

    class InnerDiv extends Component {
      render() {
        return <div bar="baz" />;
      }
    }

    class OuterDiv extends Component {
      render() {
        return createElement('div', { foo: 'bar' },
          createElement(InnerDiv)
        );
      }
    }

    renderer.render(<OuterDiv />);

    expect(renderer.getRenderOutput()).toEqualJSX(
      <div foo="bar">
        <InnerDiv />
      </div>
    );
  });

  it('calls stateless function components instead of creating an intermediate React element', () => {
    const renderer = createRenderer();

    const InnerDiv = () => <div bar="baz" />;
    const OuterDiv = () => (
      createElement('div', { foo: 'bar' },
        createElement(InnerDiv)
      )
    );

    renderer.render(<OuterDiv />);

    /**
     * Notice the difference between this and the previous test. Functionally,
     * they're the same, but because we're using stateless function components
     * here, createElement() can take advantage of referential transparency
     */
    expect(renderer.getRenderOutput()).toEqualJSX(
      <div foo="bar">
        <div bar="baz" />
      </div>
    );
  });

  it('passes children correctly', () => {
    const renderer = createRenderer();

    const Div = props => <div {...props} />;
    const InnerDiv = () => <div bar="baz" />;
    const OuterDiv = () => (
      createElement(Div, { foo: 'bar' },
        createElement(InnerDiv)
      )
    );

    renderer.render(
      <OuterDiv />
    );

    expect(renderer.getRenderOutput()).toEqualJSX(
      <div foo="bar">
        <div bar="baz" />
      </div>
    );
  });
});
