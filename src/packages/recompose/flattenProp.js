import omit from './utils/omit'
import createHelper from './createHelper'
import createEagerFactory from './createEagerFactory'

const flattenProp = propName => BaseComponent => {
  const factory = createEagerFactory(BaseComponent)
  return props => (
    factory({
      ...omit(props, [propName]),
      ...props[propName]
    })
  )
}

export default createHelper(flattenProp, 'flattenProp')
