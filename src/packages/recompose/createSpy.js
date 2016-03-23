import React from 'react'
import wrapDisplayName from './wrapDisplayName'

const createSpy = () => {
  let spyInfo = []

  function addSpyInstance(spyInstance) {
    spyInfo.unshift({
      _spy: spyInstance,
      component: null,
      props: []
    })
  }

  function removeSpyInstance(spyInstance) {
    spyInfo = spyInfo.filter(s => s._spy !== spyInstance)
  }

  function receiveProps(spyInstance, props) {
    const info = spyInfo.find(s => s._spy === spyInstance)

    if (!info) return

    info.props.unshift(props)
  }

  function updateComponent(spyInstance, component) {
    const info = spyInfo.find(s => s._spy === spyInstance)

    if (!info) return

    info.component = component
  }

  const spy = BaseComponent => {
    class Spy extends React.Component {
      constructor(props, context) {
        super(props, context)
        addSpyInstance(this)
        receiveProps(this, props)
      }

      componentWillReceiveProps(nextProps) {
        receiveProps(this, nextProps)
      }

      componentWillUnmount() {
        removeSpyInstance(this)
      }

      refCallback = ref => updateComponent(this, ref);

      render() {
        return <BaseComponent {...this.props} ref={this.refCallback} />
      }
    }

    Spy.displayName = wrapDisplayName(BaseComponent, 'spy')

    return Spy
  }

  spy.getInfo = () => spyInfo
  spy.getProps = (componentIndex = 0, renderIndex = 0) => (
    spyInfo[componentIndex].props[renderIndex]
  )
  spy.getRenderCount = (componentIndex = 0) => (
    spyInfo[componentIndex].props.length
  )
  spy.getComponent = (componentIndex = 0) => (
    spyInfo[componentIndex].component
  )

  return spy
}

export default createSpy
