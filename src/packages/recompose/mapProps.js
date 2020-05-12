import { createElement } from 'react'
import setDisplayName from './setDisplayName'
import wrapDisplayName from './wrapDisplayName'

const mapProps = propsMapper => BaseComponent => {
  const factory = createElement(BaseComponent);
  const MapProps = props => factory(propsMapper(props))
  if (process.env.NODE_ENV !== 'production') {
    return setDisplayName(wrapDisplayName(BaseComponent, 'mapProps'))(MapProps)
  }
  return MapProps
}

export default mapProps
