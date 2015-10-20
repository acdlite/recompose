import React from 'react';
import { expect } from 'chai';
import { createSpy, compose, withState, branch } from 'recompose';
import omit from 'lodash/object/omit';
import { NullComponent } from './utils';

import { renderIntoDocument } from 'react-addons-test-utils';

describe('createSpy', () => {
  it('creates a higher-order component that tracks component instances and the props they receive', () => {
    const spy = createSpy();

    const Counter = compose(
      withState('counter', 'updateCounter', 0),
      branch(
        props => props.counter === 123,
        () => NullComponent,
        spy
      )
    )('div');

    renderIntoDocument(<Counter />);
    const { updateCounter } = spy.getProps();


    expect(omit(spy.getProps(), 'updateCounter')).to.eql({ counter: 0 });

    updateCounter(1);
    expect(omit(spy.getProps(), 'updateCounter')).to.eql({ counter: 1 });

    updateCounter(2);
    expect(omit(spy.getProps(), 'updateCounter')).to.eql({ counter: 2 });

    expect(spy.getInfo().length).to.equal(1);
    updateCounter(123); // Unmount spy
    expect(spy.getInfo().length).to.equal(0);
  });

  describe('spy methods', () => {
    describe('getProps()', () => {
      it('gets the props of a spy instance for a given index, and for a given render', () => {
        const spy = createSpy();
        const Spy = compose(
          withState('n', 'updateN', props => props.initialN),
          spy
        )('div');

        renderIntoDocument(
          <div>
            <Spy initialN={1} />
            <Spy initialN={3} />
            <Spy initialN={5} />
          </div>
        );

        spy.getProps(0, 0).updateN(n => n * 7);

        expect(spy.getProps().n).to.equal(35); // Test default indices
        expect(spy.getProps(0, 0).n).to.equal(35);
        expect(spy.getProps(0, 1).n).to.equal(5);
        expect(spy.getProps(1, 0).n).to.equal(3);
        expect(spy.getProps(2, 0).n).to.equal(1);
      });
    });

    describe('getRenderCount()', () => {
      it('gets render count of a spy instance for a given index', () => {
        const spy = createSpy();
        const Spy = compose(
          withState('n', 'updateN', props => props.initialN),
          spy
        )('div');

        renderIntoDocument(
          <div>
            <Spy initialN={1} />
            <Spy initialN={3} />
            <Spy initialN={5} />
          </div>
        );

        expect(spy.getRenderCount(0)).to.equal(1);
        expect(spy.getRenderCount(1)).to.equal(1);
        expect(spy.getRenderCount(2)).to.equal(1);

        spy.getProps().updateN(n => n * 7);
        expect(spy.getRenderCount(0)).to.equal(2);
        spy.getProps().updateN(n => n * 7);
        expect(spy.getRenderCount(0)).to.equal(3);
        expect(spy.getRenderCount()).to.equal(3); // Test default index
      });
    });

    describe('getComponent()', () => {
      it('gets a ref to the spied component for a given index', () => {
        const spy = createSpy();
        const Spy = spy(class extends React.Component {
          n = this.props.n;

          render() {
            return <div />;
          }
        });

        renderIntoDocument(
          <div>
            <Spy n={1} />
            <Spy n={3} />
            <Spy n={5} />
          </div>
        );

        expect(spy.getComponent().n).to.equal(5); // Test default index
        expect(spy.getComponent(0).n).to.equal(5);
        expect(spy.getComponent(1).n).to.equal(3);
        expect(spy.getComponent(2).n).to.equal(1);
      });
    });
  });
});
