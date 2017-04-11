import Relay from 'react-relay'
import { toClass, createHelper } from 'recompose'

const createContainer = options => BaseComponent =>
  Relay.createContainer(toClass(BaseComponent), options)

export default createHelper(createContainer, 'createContainer', false)
