import { createFactory } from 'react'
import composeWithDisplayName from './composeWithDisplayName'

const identity = Component => Component

const branch = (test, left, right = identity) =>
  composeWithDisplayName('branch', BaseComponent => {
    let leftFactory
    let rightFactory
    const Branch = props => {
      if (test(props)) {
        leftFactory = leftFactory || createFactory(left(BaseComponent))
        return leftFactory(props)
      }
      rightFactory = rightFactory || createFactory(right(BaseComponent))
      return rightFactory(props)
    }

    return Branch
  })

export default branch
