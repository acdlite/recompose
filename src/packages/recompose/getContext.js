import React from 'react'
import { getContextPair } from './contextManager'
import setDisplayName from './setDisplayName'
import wrapDisplayName from './wrapDisplayName'
import mapValues from './utils/mapValues'

const wrapComponent = (BaseComponent, consumers, props) => {
  if (consumers.length > 0) {
    const Consumer = consumers[0]
    return (
      <Consumer>
        {value =>
          wrapComponent(BaseComponent, consumers.slice(1), {
            ...props,
            [Consumer.contextName]: value,
          })}
      </Consumer>
    )
  }
  return <BaseComponent {...props} />
}

const getContext = childContextTypes => BaseComponent => {
  const contextNames = Object.keys(childContextTypes)
  const contextConsumers = mapValues(
    childContextTypes,
    (v, k) => getContextPair(k).Consumer
  )
  const consumers = contextNames.map(name => contextConsumers[name])

  const GetContext = props => wrapComponent(BaseComponent, consumers, props)

  if (process.env.NODE_ENV !== 'production') {
    return setDisplayName(wrapDisplayName(BaseComponent, 'getContext'))(
      GetContext
    )
  }
  return GetContext
}

export default getContext
