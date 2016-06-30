import { Component } from 'react'
import createHelper from './createHelper'
import createEagerFactory from './createEagerFactory'
import shallowEqual from './shallowEqual'
import pick from './utils/pick'

const asyncMapPropsOnChange = (propNames, transform) => BaseComponent => {
  const factory = createEagerFactory(BaseComponent)
  const pickProps = props => pick(props, propNames)
  return class extends Component {
    state = {
      flatMappedProps: null
    };

    didReceiveProps = false;
    updateCounter = 0

    transformProps(props) {
      this.updateCounter += 1
      const id = this.updateCounter
      transform(props).then(flatMappedProps => {
        if (id === this.updateCounter) {
          this.didReceiveProps = true
          if (!this.didUnmount) {
            this.setState({ flatMappedProps })
          }
        }
      })
    }

    componentWillMount() {
      this.transformProps(this.props)
    }

    componentWillReceiveProps(nextProps) {
      if (!shallowEqual(pickProps(this.props), pickProps(nextProps))) {
        this.transformProps(nextProps)
      }
    }

    componentWillUnmount() {
      this.didUnmount = true
    }

    render() {
      if (!this.didReceiveProps) {
        return null
      }
      return factory({
        ...this.props,
        ...this.state.flatMappedProps
      })
    }
  }
}

export default createHelper(asyncMapPropsOnChange, 'asyncMapPropsOnChange')
