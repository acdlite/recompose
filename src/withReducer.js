import React from 'react';
import curry from 'lodash/function/curry';
import isFunction from 'lodash/lang/isFunction';
import wrapDisplayName from './wrapDisplayName';

const withReducer = (
  stateName,
  dispatchName,
  reducer,
  initialState,
  BaseComponent
) => (
  class extends React.Component {
    static displayName = wrapDisplayName(BaseComponent, 'withReducer');

    state = {
      stateValue: isFunction(initialState)
        ? initialState(this.props)
        : initialState
    };

    dispatch = action => this.setState(({ stateValue }) => ({
      stateValue: reducer(stateValue, action)
    }));

    render() {
      return (
        <BaseComponent
          {...{
            ...this.props,
            [stateName]: this.state.stateValue,
            [dispatchName]: this.dispatch
          }}
        />
      );
    }
  }
);

export default curry(withReducer);
