import { toArray } from 'lodash'
import compose from './compose'

const createComponent = (...args) => {
  const decorators = toArray(args)
  const baseComponent = decorators.pop()
  return compose(...decorators)(baseComponent)
}

export default createComponent
