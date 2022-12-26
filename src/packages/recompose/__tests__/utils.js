import React from 'react'
import composeWithDisplayName from '../composeWithDisplayName'

export const countRenders = composeWithDisplayName(
  'countRenders',
  BaseComponent =>
    class CountRenders extends React.Component {
      renderCount = 0

      render() {
        this.renderCount += 1
        return <BaseComponent renderCount={this.renderCount} {...this.props} />
      }
    }
)
