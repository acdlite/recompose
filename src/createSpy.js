import React from 'react';
import isUndefined from 'lodash/lang/isUndefined';
import wrapDisplayName from './wrapDisplayName';

const createSpy = () => {
  let spyInfo = [];

  function addSpyInstance(spyInstance) {
    spyInfo.push({
      _spy: spyInstance,
      component: null,
      props: []
    });
  }

  function removeSpyInstance(spyInstance) {
    spyInfo = spyInfo.filter(s => s._spy !== spyInstance);
  }

  function receiveProps(spyInstance, props) {
    const info = spyInfo.find(s => s._spy === spyInstance);

    if (!info) return;

    info.props.push(props);
  }

  function updateComponent(spyInstance, component) {
    const info = spyInfo.find(s => s._spy === spyInstance);

    if (!info) return;

    info.component = component;
  }

  const spy = BaseComponent => class extends React.Component {
    static displayName = wrapDisplayName(BaseComponent, 'spy');

    constructor(props, context) {
      super(props, context);
      addSpyInstance(this);
      receiveProps(this, props);
    }

    componentWillReceiveProps(nextProps) {
      receiveProps(this, nextProps);
    }

    componentWillUnmount() {
      removeSpyInstance(this);
    }

    refCallback = ref => updateComponent(this, ref);

    render() {
      return <BaseComponent {...this.props} ref={this.refCallback} />;
    }
  };

  spy.getInfo = () => spyInfo;
  spy.getProps = (_componentIndex, _renderIndex) => {
    const componentIndex = isUndefined(_componentIndex)
      ? spyInfo.length - 1
      : _componentIndex;
    const renderIndex = isUndefined(_renderIndex)
      ? spyInfo[componentIndex].props.length - 1
      : _renderIndex;

    return spyInfo[componentIndex].props[renderIndex];
  };
  spy.getRenderCount = (_componentIndex) => {
    const componentIndex = isUndefined(_componentIndex)
      ? spyInfo.length - 1
      : _componentIndex;

    return spyInfo[componentIndex].props.length;
  };
  spy.getComponent = componentIndex => spyInfo[componentIndex].component;

  return spy;
};

export default createSpy;
