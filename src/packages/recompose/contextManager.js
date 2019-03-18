import { createContext } from 'react'

const contextCache = {}

export const getContextPair = contextName => {
  if (contextCache[contextName]) {
    return contextCache[contextName]
  }
  const contextPair = createContext()
  contextPair.Provider.contextName = contextName
  contextPair.Consumer.contextName = contextName
  contextCache[contextName] = contextPair
  return contextPair
}
