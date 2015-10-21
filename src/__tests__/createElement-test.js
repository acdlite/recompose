import React, { Component } from 'react';
import expect from 'expect';
import expectJSX from 'expect-jsx';
import createElement from '../createElement';

expect.extend(expectJSX);

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
        return <div foo="bar" />;
      }
    }

    class OuterDiv extends Component {
      render() {
        return createElement('div', {
          children: createElement(InnerDiv)
        });
      }
    }

    renderer.render(<OuterDiv />);

    expect(renderer.getRenderOutput()).toEqualJSX(
      <div>
        <InnerDiv />
      </div>
    );
  });

  it('calls stateless function components instead of creating an intermediate React element', () => {
    const renderer = createRenderer();

    const InnerDiv = () => <div foo="bar" />;
    const OuterDiv = () => (
      createElement('div', {
        children: createElement(InnerDiv)
      })
    );

    renderer.render(<OuterDiv />);

    /**
     * Notice the difference between this and the previous test. Functionally,
     * they're the same, but because we're using stateless function components
     * here, createElement() can take advantage of referential transparency
     */
    expect(renderer.getRenderOutput()).toEqualJSX(
      <div>
        <div foo="bar" />
      </div>
    );
  });
});
