import shouldUpdate from './shouldUpdate'
import shallowEqual from './shallowEqual'
import setDisplayName from './setDisplayName'
import wrapDisplayName from './wrapDisplayName'

const pure = BaseComponent => {
  const hoc = shouldUpdate(
    (props, nextProps) => !shallowEqual(props, nextProps)
  )

  if (process.env.NODE_ENV !== 'production') {
    return setDisplayName(wrapDisplayName(BaseComponent, 'pure'))(
      hoc(BaseComponent)
    )
  }

  return hoc(BaseComponent)
}

export default pure
