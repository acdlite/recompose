import { Component } from 'react';
import curry from 'lodash/function/curry';
import wrapDisplayName from './wrapDisplayName';
import shallowEqual from './shallowEqual';
import pick from 'lodash/object/pick';
import createElement from './createElement';

const mapPropsOnChange = (depdendentPropKeys, propsMapper, BaseComponent) => {
  const pickDependentProps = props => pick(props, depdendentPropKeys);

  return class extends Component {
    static displayName = wrapDisplayName(BaseComponent, 'mapPropsOnChange');
    childProps = propsMapper(this.props);

    componentWillReceiveProps(nextProps) {
      if (!shallowEqual(
        pickDependentProps(this.props),
        pickDependentProps(nextProps)
      )) {
        this.childProps = propsMapper(nextProps);
      }
    }

    render() {
      return createElement(BaseComponent, this.childProps);
    }
  };
};

export default curry(mapPropsOnChange);
