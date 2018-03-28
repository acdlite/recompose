import React from 'react'
import setDisplayName from './setDisplayName'
import wrapDisplayName from './wrapDisplayName'

export default function logRender(WrappedComponent) {
  class LogRender extends React.Component {
    render() {
      if (process.env.NODE_ENV !== 'production') {
        console.group('logRender - props')
        console.dir(this.props)
        console.groupEnd()
      }

      return <WrappedComponent {...this.props} />
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    return setDisplayName(wrapDisplayName(WrappedComponent, 'logRender'))(
      LogRender
    )
  }

  return LogRender
}
