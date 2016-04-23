import createComponent from './createComponent'
import pure from './pure'

const createPureComponent = (...args) => pure(createComponent(...args))

export default createPureComponent
