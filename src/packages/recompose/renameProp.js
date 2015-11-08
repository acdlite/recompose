import omit from 'lodash/object/omit'
import mapProps from './mapProps'
import createHelper from './createHelper'

const renameProp = (oldName, newName, BaseComponent) =>
  mapProps(props => ({
    ...omit(props, oldName),
    [newName]: props[oldName]
  }), BaseComponent)

export default createHelper(renameProp, 'renameProp')
