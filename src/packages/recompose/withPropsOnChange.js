import { createFactory, Component } from 'react'
import pick from './utils/pick'
import shallowEqual from './shallowEqual'
import setDisplayName from './setDisplayName'
import wrapDisplayName from './wrapDisplayName'

const withPropsOnChange = (shouldMapOrKeys, propsMapper) => BaseComponent => {
  const factory = createFactory(BaseComponent)
  const shouldMap =
    typeof shouldMapOrKeys === 'function'
      ? shouldMapOrKeys
      : (props, nextProps) =>
          !shallowEqual(
            pick(props, shouldMapOrKeys),
            pick(nextProps, shouldMapOrKeys)
          )

  class WithPropsOnChange extends Component {
    computedProps = propsMapper(this.props)

    componentWillReceiveProps(nextProps) {
      if (shouldMap(this.props, nextProps)) {
        this.computedProps = propsMapper(nextProps)
      }
    }

    render() {
      return factory({
        ...this.props,
        ...this.computedProps,
      })
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    return setDisplayName(wrapDisplayName(BaseComponent, 'withPropsOnChange'))(
      WithPropsOnChange
    )
  }
  return WithPropsOnChange
}

export default withPropsOnChange
