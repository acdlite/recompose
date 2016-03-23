import omit from 'lodash/omit'
import mapProps from './mapProps'
import createHelper from './createHelper'

const renameProp = (oldName, newName) =>
  mapProps(props => ({
    ...omit(props, oldName),
    [newName]: props[oldName]
  }))

export default createHelper(renameProp, 'renameProp')
