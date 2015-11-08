import Relay from 'react-relay'
import curry from 'lodash/function/curry'
import toClass from 'recompose/toClass'

const createContainer = (options, BaseComponent) => (
  Relay.createContainer(toClass(BaseComponent), options)
)

export default curry(createContainer)
