import curry from 'lodash/function/curry'
import wrapDisplayName from './wrapDisplayName'
import createElement from './createElement'

const mapProps = (propsMapper, BaseComponent) => {
  const MapProps = props => createElement(BaseComponent, propsMapper(props))

  MapProps.displayName = wrapDisplayName(BaseComponent, 'mapProps')

  return MapProps
}

export default curry(mapProps)
