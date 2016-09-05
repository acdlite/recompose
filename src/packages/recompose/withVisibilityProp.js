import shouldUpdate from './shouldUpdate'
import shallowEqual from './shallowEqual'
import createHelper from './createHelper'

const withVisibilityProp = (visibilityPropName = 'visible', updateForValue = true) =>
  shouldUpdate(
    (props, nextProps) => {
      if (
        nextProps[visibilityPropName] === props[visibilityPropName]
        && props[visibilityPropName] === !updateForValue
      ) {
        return false
      }
      return !shallowEqual(nextProps, props)
    }
  )

export default createHelper(withVisibilityProp, 'withVisibilityProp')
