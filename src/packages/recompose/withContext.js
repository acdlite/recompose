import React from 'react'
import { getContextPair } from './contextManager'
import setDisplayName from './setDisplayName'
import wrapDisplayName from './wrapDisplayName'
import mapValues from './utils/mapValues'

const withContext = (childContextTypes, getChildContext) => BaseComponent => {
  const contextNames = Object.keys(childContextTypes)
  const contextProviders = mapValues(
    childContextTypes,
    (v, k) => getContextPair(k).Provider
  )
  const WithContext = props => {
    const contextValues = getChildContext(props)
    const element = contextNames.reduce(
      (acc, contextName) =>
        React.createElement(
          contextProviders[contextName],
          { value: contextValues[contextName] },
          acc
        ),
      React.createElement(BaseComponent, props)
    )

    return element
  }

  if (process.env.NODE_ENV !== 'production') {
    return setDisplayName(wrapDisplayName(BaseComponent, 'withContext'))(
      WithContext
    )
  }
  return WithContext
}

export default withContext
