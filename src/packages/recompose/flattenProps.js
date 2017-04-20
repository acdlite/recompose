import createHelper from './createHelper'
import createEagerFactory from './createEagerFactory'

const flattenProps = propNames => BaseComponent => {
  const factory = createEagerFactory(BaseComponent)

  return props => (
    factory({
      ...props,
      ...propNames.reduce((flattenedProps, propName) => ({
        ...flattenedProps,
        ...props[propName]
      }), {})
    })
  )
}

export default createHelper(flattenProps, 'flattenProps')
