import createHelper from './createHelper'
import createEagerFactory from './createEagerFactory'

const mapProps = propsMapper => BaseComponent => {
  const factory = createEagerFactory(BaseComponent)
  return props => factory(propsMapper(props))
}

export default createHelper(mapProps, 'mapProps')
