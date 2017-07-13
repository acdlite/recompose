/* @flow */
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { css } from 'glamor'
import 'glamor-reset'

css.insert(`
  body, html {
    height: 100vh;
    font-size: 16px;
    color: #666;
    -webkit-font-smoothing: antialiased;
    background-color: indigo;
  }
`)

css.insert(`
  * {
    min-width: 0;
    min-height: 0;
    box-sizing: border-box;
  }
`)

css.insert(`
  #root {
    min-height: 100%; /* not 100 vh because of mobile chrome */
    display: flex;
  }
`)

const mountNode = document.getElementById('root')
ReactDOM.render(<App />, mountNode)

if (module.hot) {
  ;((module.hot: any): {
    accept: (a: string, b: () => void) => void,
  }).accept('./App', () => {
    const NextApp = require('./App').default // eslint-disable-line
    ReactDOM.render(<NextApp />, mountNode)
  })
}
