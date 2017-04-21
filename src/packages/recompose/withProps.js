import createHelper from './createHelper'
import mapProps from './mapProps'

const withProps = input =>
  mapProps(props => ({
    ...props,
    ...(typeof input === 'function' ? input(props) : input),
  }))

export default createHelper(withProps, 'withProps')
