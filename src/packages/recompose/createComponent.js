import { isString, toArray } from 'lodash'
import compose from './compose'
import setDisplayName from './setDisplayName'

const createComponent = (...args) => {
  const decorators = toArray(args)
  const baseComponent = decorators.pop()
  let component = baseComponent

  if (isString(decorators[0])) {
    const displayName = decorators.shift()
    component = setDisplayName(displayName)(component)
  }

  component = compose(...decorators)(component)

  component.baseComponent = baseComponent

  return component
}

export default createComponent
