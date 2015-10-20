import React from 'react';
import curry from 'lodash/function/curry';
import wrapDisplayName from './wrapDisplayName';
import createElement from './createElement';

const lifecycle = (setup, teardown, BaseComponent) => (
  class Lifecycle extends React.Component {
    static displayName = wrapDisplayName(BaseComponent, 'lifecycle');

    constructor(props, context) {
      super(props, context);
      setup(this);
    }

    componentWillUnmount() {
      teardown(this);
    }

    render() {
      return createElement(BaseComponent, {
        ...this.props,
        ...this.state
      });
    }
  }
);

export default curry(lifecycle);
