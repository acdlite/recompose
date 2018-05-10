import { createFactory, Component } from 'react'
import { polyfill } from 'react-lifecycles-compat'
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
    state = {
      computedProps: propsMapper(this.props),
      prevProps: this.props,
    }

    static getDerivedStateFromProps(nextProps, prevState) {
      if (shouldMap(prevState.prevProps, nextProps)) {
        return {
          computedProps: propsMapper(nextProps),
          prevProps: nextProps,
        }
      }

      return {
        prevProps: nextProps,
      }
    }

    render() {
      return factory({
        ...this.props,
        ...this.state.computedProps,
      })
    }
  }

  polyfill(WithPropsOnChange)

  if (process.env.NODE_ENV !== 'production') {
    return setDisplayName(wrapDisplayName(BaseComponent, 'withPropsOnChange'))(
      WithPropsOnChange
    )
  }

  return WithPropsOnChange
}

export default withPropsOnChange
