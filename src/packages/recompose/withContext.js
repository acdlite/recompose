import React, { Component } from 'react'
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
  class WithContext extends Component {
    getChildContext = () => getChildContext(this.props)

    render() {
      const contextValues = this.getChildContext()
      const element = contextNames.reduce((acc, contextName) => {
        const Provider = contextProviders[contextName]
        return (
          <Provider value={contextValues[contextName]}>
            {acc}
          </Provider>
        )
      }, <BaseComponent {...this.props} />)

      return element
    }
  }

  WithContext.childContextTypes = childContextTypes

  if (process.env.NODE_ENV !== 'production') {
    return setDisplayName(wrapDisplayName(BaseComponent, 'withContext'))(
      WithContext
    )
  }
  return WithContext
}

export default withContext
