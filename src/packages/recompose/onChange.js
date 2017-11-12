import { createFactory, Component } from 'react'
import setDisplayName from './setDisplayName'
import wrapDisplayName from './wrapDisplayName'
import shallowEqual from './shallowEqual'

const onChange = (
  propName,
  callback,
  arePropEqual = shallowEqual
) => BaseComponent => {
  const factory = createFactory(BaseComponent)

  class OnChange extends Component {
    componentDidMount() {
      if (this.props.hasOwnProperty(propName)) {
        callback(this.props)
      }
    }

    componentWillReceiveProps(nextProps) {
      if (!arePropEqual(nextProps[propName], this.props[propName])) {
        callback(nextProps)
      }
    }

    render() {
      return factory({
        ...this.props,
      })
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    return setDisplayName(wrapDisplayName(BaseComponent, 'onChange'))(OnChange)
  }
  return OnChange
}

export default onChange
