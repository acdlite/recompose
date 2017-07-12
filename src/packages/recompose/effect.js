import setDisplayName from './setDisplayName'
import wrapDisplayName from './wrapDisplayName'
import createEagerFactory from './createEagerFactory'

const effect = (fn = () => {}) => BaseComponent => {
  const factory = createEagerFactory(BaseComponent)
  const Effect = props => {
    fn(props)
    return factory(props)
  }
  if (process.env.NODE_ENV !== 'production') {
    return setDisplayName(wrapDisplayName(BaseComponent, 'effect'))(Effect)
  }
  return Effect
}

export default effect
