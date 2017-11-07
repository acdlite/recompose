import { createFactory, Component } from 'react'
import setDisplayName from './setDisplayName'
import wrapDisplayName from './wrapDisplayName'

const withPropChangeHandler = (keys, propChangeHandler) => BaseComponent => {
  const factory = createFactory(BaseComponent)

  class WithPropChangeHandler extends Component {
    componentWillMount() {
      propChangeHandler(this.props, {})
    }

    componentWillReceiveProps(nextProps) {
      const { props } = this

      const keysToCompare =
        keys || Object.keys(nextProps).concat(Object.keys(props))

      const propChanged = keysToCompare
        .map(key => nextProps[key] !== props[key])
        .reduce((a, b) => a || b, false)

      if (propChanged) {
        propChangeHandler(nextProps, props)
      }
    }

    componentWillUnmount() {
      propChangeHandler({}, this.props)
    }

    render() {
      return factory(this.props)
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    return setDisplayName(
      wrapDisplayName(BaseComponent, 'withPropChangeHandler')
    )(WithPropChangeHandler)
  }

  return WithPropChangeHandler
}

export default withPropChangeHandler
