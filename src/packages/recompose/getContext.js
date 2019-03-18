import React from 'react'
import compose from './compose'
import { getContextPair } from './contextManager'
import setDisplayName from './setDisplayName'
import wrapDisplayName from './wrapDisplayName'
import mapValues from './utils/mapValues'

const consumerHoc = (Consumer, contextName) => BaseComponent => props => (
  <Consumer>
    {value => <BaseComponent {...{ ...props, [contextName]: value }} />}
  </Consumer>
)

const getContext = childContextTypes => BaseComponent => {
  const contextNames = Object.keys(childContextTypes)
  const contextConsumers = mapValues(
    childContextTypes,
    (v, k) => getContextPair(k).Consumer
  )

  const enhancer = compose(
    ...contextNames.map(contextName =>
      consumerHoc(contextConsumers[contextName], contextName)
    )
  )

  const GetContext = enhancer(BaseComponent)

  if (process.env.NODE_ENV !== 'production') {
    return setDisplayName(wrapDisplayName(BaseComponent, 'getContext'))(
      GetContext
    )
  }
  return GetContext
}

export default getContext
