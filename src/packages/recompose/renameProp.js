import curry from 'lodash/function/curry'
import omit from 'lodash/object/omit'
import wrapDisplayName from './wrapDisplayName'
import mapProps from './mapProps'

const renameProp = (oldName, newName, BaseComponent) => {
  const RenameProp = mapProps(props => ({
    ...omit(props, oldName),
    [newName]: props[oldName]
  }), BaseComponent)

  RenameProp.displayName = wrapDisplayName(BaseComponent, 'renameProp')

  return RenameProp
}

export default curry(renameProp)
