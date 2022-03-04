import React from 'react'

export function createFactory(Component) {
  return (props, ...children) =>
    React.createElement(Component, props, ...children)
}
