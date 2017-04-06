import Relay from 'react-relay/classic'
import toClass from 'recompose/toClass'
import createHelper from 'recompose/createHelper'

const createContainer = options => BaseComponent =>
  Relay.createContainer(toClass(BaseComponent), options)

export default createHelper(createContainer, 'createContainer', false)
