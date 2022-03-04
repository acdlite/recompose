import setDisplayName from './setDisplayName'
import wrapDisplayName from './wrapDisplayName'
import { createFactory } from './utils/factory'

const mapProps = (propsMapper) => (BaseComponent) => {
  const factory = createFactory(BaseComponent)
  const MapProps = (props) => factory(propsMapper(props))
  if (process.env.NODE_ENV !== 'production') {
    return setDisplayName(wrapDisplayName(BaseComponent, 'mapProps'))(MapProps)
  }
  return MapProps
}

export default mapProps
