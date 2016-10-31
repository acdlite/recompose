import createHelper from './createHelper'
import createEagerFactory from './createEagerFactory'

const identity = Component => Component

const branch = (test, left, right = identity) => BaseComponent => {
  let leftFactory
  let rightFactory
  return props => {
    if (test(props)) {
      leftFactory = leftFactory || createEagerFactory(left(BaseComponent))
      return leftFactory(props)
    }
    rightFactory = rightFactory || createEagerFactory(right(BaseComponent))
    return rightFactory(props)
  }
}

export default createHelper(branch, 'branch')
