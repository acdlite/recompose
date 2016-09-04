import shouldUpdate from './shouldUpdate'
import shallowEqual from './shallowEqual'
import createHelper from './createHelper'

const withVisibilityProp = (visiblePropName = 'visible') =>
  shouldUpdate(
    (props, nextProps) => {
      if (
        nextProps[visiblePropName] === props[visiblePropName]
        && props[visiblePropName] === false
      ) {
        return false
      }
      return !shallowEqual(nextProps, props)
    }
  )

export default createHelper(withVisibilityProp, 'withVisibilityProp')
