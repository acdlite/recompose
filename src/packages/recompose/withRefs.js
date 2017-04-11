import createHelper from './createHelper'
import createEagerFactory from './createEagerFactory'

const withRefs = refsMap => BaseComponent => {
  const factory = createEagerFactory(BaseComponent)

  const refs = {}

  return props => factory({
    ...props,
    refs,
    ...Object.keys(refsMap).reduce((acc, refName) => ({
      ...acc,
      [refsMap[refName]]: (element) => {
        refs[refName] = element
      }
    }), {})
  })
}

export default createHelper(withRefs, 'withRefs')
