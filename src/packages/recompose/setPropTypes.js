import setStatic from './setStatic'
import createHelper from './createHelper'

const setPropTypes = propTypes => BaseComponent => {
  const newProps = typeof propTypes === 'function'
          ? propTypes(BaseComponent.propTypes)
          : propTypes
  return setStatic('propTypes', newProps)(BaseComponent)
}

export default createHelper(setPropTypes, 'setPropTypes', false)
