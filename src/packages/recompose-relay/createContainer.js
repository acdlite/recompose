import Relay from 'react-relay-compat'
import { toClass } from 'recompose'

const createContainer = options => BaseComponent =>
  Relay.createContainer(toClass(BaseComponent), options)

export default createContainer
