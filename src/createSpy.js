import React from 'react';
import wrapDisplayName from './wrapDisplayName';

const createSpy = () => {
  let componentInfo = [];

  function addComponent(component) {
    componentInfo.push({
      component,
      props: []
    });
  }

  function removeComponent(component) {
    componentInfo = componentInfo.filter(i => i.component !== component);
  }

  function recievePropsForComponent(component, props) {
    const info = componentInfo.find(i => i.component === component);

    if (!info) return;

    info.props.push(props);
  }

  const spy = BaseComponent => class extends React.Component {
    static displayName = wrapDisplayName(BaseComponent, 'spy');

    constructor(props, context) {
      super(props, context);
      addComponent(this);
      recievePropsForComponent(this, props);
    }

    componentWillReceiveProps(nextProps) {
      recievePropsForComponent(this, nextProps);
    }

    componentWillUnmount() {
      removeComponent(this);
    }

    render() {
      return <BaseComponent {...this.props} />;
    }
  };

  spy.getComponentInfo = () => componentInfo;
  spy.getProps = (componentIndex, renderIndex) => (
    componentInfo[componentIndex].props[renderIndex]
  );

  return spy;
};

export default createSpy;
