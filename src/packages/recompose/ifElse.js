import setDisplayName from './setDisplayName'
import wrapDisplayName from './wrapDisplayName'
import createEagerFactory from './createEagerFactory'

const ifElse = (test, left, right) => BaseComponent => {
  const IfElse = props => {
    if (test(props)) {
      left(props)
    } else if (right) {
      right(props)
    }

    return createEagerFactory(BaseComponent)(props)
  }

  if (process.env.NODE_ENV !== 'production') {
    return setDisplayName(wrapDisplayName(BaseComponent, 'ifElse'))(IfElse)
  }
  return IfElse
}

export default ifElse
