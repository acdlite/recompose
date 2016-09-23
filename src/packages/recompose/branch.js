import React from 'react'
import createHelper from './createHelper'
import createEagerFactory from './createEagerFactory'

const identity = component => component

const branch = (test, left, right) => BaseComponent =>
  class extends React.Component {
    LeftComponent = null;
    RightComponent = null;

    constructor(props, context) {
      super(props, context)
      this.computeChildComponent(this.props)
    }

    computeChildComponent(props) {
      if (test(props)) {
        this.leftFactory =
          this.leftFactory || createEagerFactory(left(BaseComponent))
        this.factory = this.leftFactory
      } else {
        this.rightFactory =
          this.rightFactory ||
            createEagerFactory((right || identity)(BaseComponent))
        this.factory = this.rightFactory
      }
    }

    componentWillReceiveProps(nextProps) {
      this.computeChildComponent(nextProps)
    }

    render() {
      return this.factory(this.props)
    }
  }

export default createHelper(branch, 'branch')
