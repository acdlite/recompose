import React from 'react';
import curry from 'lodash/function/curry';
import wrapDisplayName from './wrapDisplayName';

const branch = (test, left, right, BaseComponent) => (
  class extends React.Component {
    static displayName = wrapDisplayName(BaseComponent, 'branch');
    LeftComponent = null;
    RightComponent = null;

    constructor(props, context) {
      super(props, context);
      this.computeChildComponent(this.props);
    }

    computeChildComponent(props) {
      if (test(props)) {
        this.LeftComponent = this.LeftComponent || left(BaseComponent);
        this.Component = this.LeftComponent;
      } else {
        this.RightComponent = this.RightComponent || right(BaseComponent);
        this.Component = this.RightComponent;
      }
    }

    componentWillReceiveProps(nextProps) {
      this.computeChildComponent(nextProps);
    }

    render() {
      const { Component } = this;
      return <Component {...this.props} />;
    }
  }
);

export default curry(branch);
