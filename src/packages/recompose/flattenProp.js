import curry from 'lodash/function/curry'
import omit from 'lodash/object/omit'
import wrapDisplayName from './wrapDisplayName'
import createElement from './createElement'

const flattenProp = (propName, BaseComponent) => {
  const FlattenProps = props => (
    createElement(BaseComponent, {
      ...omit(props, propName),
      ...props[propName]
    })
  )

  FlattenProps.displayName = wrapDisplayName(BaseComponent, 'flattenProp')

  return FlattenProps
}

export default curry(flattenProp)
