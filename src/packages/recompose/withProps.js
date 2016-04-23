import isFunction from 'lodash/isFunction'
import createHelper from './createHelper'
import mapProps from './mapProps'

const withProps = input =>
  mapProps(props => ({
    ...props,
    ...(
      isFunction(input)
       ? input(props)
       : input
    )
  }))

export default createHelper(withProps, 'withProps')
