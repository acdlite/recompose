import { createFactory, Component } from 'react'
import { polyfill } from 'react-lifecycles-compat'
import pick from './utils/pick'
import shallowEqual from './shallowEqual'
import setDisplayName from './setDisplayName'
import wrapDisplayName from './wrapDisplayName'

const withPropsOnChange = (
  shouldMapOrKeys,
  propsMapper,
  memoize = fn => fn
) => BaseComponent => {
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
    memoizedPropsMapper = memoize(propsMapper)
    computedProps = this.memoizedPropsMapper(this.props)
    recalc = {}

    state = {
      recalc: this.recalc,
    }

    static getDerivedStateFromProps(nextProps, prevState) {
      if (!prevState.prevProps) {
        return {
          prevProps: nextProps,
        }
      }

      if (shouldMap(prevState.prevProps, nextProps)) {
        return {
          recalc: {},
          prevProps: nextProps,
        }
      }

      return null
    }

    render() {
      if (this.recalc !== this.state.recalc) {
        this.recalc = this.state.recalc
        this.computedProps = this.memoizedPropsMapper(this.props)
      }

      return factory({
        ...this.props,
        ...this.computedProps,
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
