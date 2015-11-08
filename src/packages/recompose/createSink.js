import React from 'react'

const createSink = callback =>
  props => {
    callback(props)
    return <div />
  }

export default createSink
