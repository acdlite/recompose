import React from 'react';
import curry from 'lodash/function/curry';
import wrapDisplayName from './wrapDisplayName';
import shallowEqual from './shallowEqual';
import pick from 'lodash/object/pick';

const mapPropsOnUpdate = (depdendentPropKeys, propsMapper, BaseComponent) => {
  const pickDependentProps = props => pick(props, depdendentPropKeys);

  return class extends React.Component {
    static displayName = wrapDisplayName(BaseComponent, 'mapPropsOnUpdate');
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
      return <BaseComponent {...this.childProps} />;
    }
  };
};

export default curry(mapPropsOnUpdate);
