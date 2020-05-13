import React from 'react'
import setDisplayName from '../setDisplayName'
import wrapDisplayName from '../wrapDisplayName'

export const countRenders = BaseComponent => {
  class CountRenders extends React.Component {
    renderCount = 0

    render() {
      this.renderCount += 1
      return <BaseComponent renderCount={this.renderCount} {...this.props} />
    }
  }

  return setDisplayName(wrapDisplayName(BaseComponent, 'countRenders'))(
    CountRenders
  )
}
