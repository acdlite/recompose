import React, { PropTypes, Component } from 'react';
import { expect } from 'chai';
import { lifecycle, compose, withState } from '../';
import { BaseComponent } from './utils';

import {
  findRenderedComponentWithType,
  renderIntoDocument
} from 'react-addons-test-utils';

describe('lifecycle()', () => {
  it('gives access to the component instance on setup and teardown', () => {
    let listeners = [];

    const subscribe = listener => {
      listeners.push(listener);
      return () => {
        listeners = listeners.filter(l => l !== listener);
      };
    };

    const emit = () => {
      listeners.forEach(l => l());
    };

    const Lifecycle = compose(
      lifecycle(
        component => {
          component.state = { counter: 0 };
          component.dispose = subscribe(() => {
            component.setState(state => ({ counter: state.counter + 1 }));
          });
        },
        component => {
          component.dispose();
        }
      )
    )(BaseComponent);

    // TODO: Use stateless component once React TestUtils supports it
    class Toggle extends Component {
      static propTypes = {
        isVisible: PropTypes.bool
      };

      static defaultProps = {
        isVisible: false
      };

      render() {
        return this.props.isVisible
          ? <Lifecycle />
          : null;
      }
    }

    const ToggleContainer =
      withState('isVisible', 'updateIsVisible', false)(Toggle);

    const tree = renderIntoDocument(<ToggleContainer pass="through" />);
    const toggle = findRenderedComponentWithType(tree, Toggle);

    toggle.props.updateIsVisible(true);
    expect(listeners.length).to.equal(1);
    const base = findRenderedComponentWithType(tree, BaseComponent);

    expect(base.props.counter).to.equal(0);
    emit();
    expect(base.props.counter).to.equal(1);
    emit();
    expect(base.props.counter).to.equal(2);

    toggle.props.updateIsVisible(false);
    expect(listeners.length).to.equal(0);
  });
});
