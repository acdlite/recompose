import React from 'react';
import curry from 'lodash/function/curry';
import isFunction from 'lodash/lang/isFunction';
import wrapDisplayName from './wrapDisplayName';

export const withState = (
  stateName,
  stateUpdaterName,
  initialState,
  BaseComponent
) => (
  class extends React.Component {
    static displayName = wrapDisplayName(BaseComponent, 'withState');
    state = {
      stateValue: isFunction(initialState)
        ? initialState(this.props)
        : initialState
    };

    updateStateValue = (updateFn, callback) => (
      this.setState(({ stateValue }) => ({
        stateValue: isFunction(updateFn) ? updateFn(stateValue) : updateFn
      }), callback)
    )

    render() {
      const childProps = {
        ...this.props,
        [stateName]: this.state.stateValue,
        [stateUpdaterName]: this.updateStateValue
      };
      return <BaseComponent {...childProps}/>;
    }
  }
);

export default curry(withState);
