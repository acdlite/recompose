import { Component } from 'react'

class Nothing extends Component {
  render() {
    return null
  }
}

Nothing.displayName = 'Nothing'

const renderNothing = _ => Nothing

export default renderNothing
