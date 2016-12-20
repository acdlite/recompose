import { Component } from 'react'
import createHelper from './createHelper'

class Nothing extends Component {
  render() {
    return null
  }
}

Nothing.displayName = 'Nothing'

const renderNothing = _ => Nothing

export default createHelper(renderNothing, 'renderNothing', false, true)
