import shouldUpdate from './shouldUpdate'
import shallowEqual from './shallowEqual'
import setDisplayName from './setDisplayName'
import wrapDisplayName from './wrapDisplayName'

const onlyUpdateForKeysFunc = checkFunc => {
  const hoc = shouldUpdate(
    (props, nextProps) => !shallowEqual(checkFunc(props), checkFunc(nextProps))
  )

  if (process.env.NODE_ENV !== 'production') {
    return BaseComponent =>
      setDisplayName(wrapDisplayName(BaseComponent, 'onlyUpdateForKeysFunc'))(
        hoc(BaseComponent)
      )
  }

  return hoc
}

export default onlyUpdateForKeysFunc
