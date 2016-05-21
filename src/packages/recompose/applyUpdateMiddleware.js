import { Component } from 'react'
import createEagerFactory from './createEagerFactory'

const applyUpdateMiddleware = (...middlewares) => BaseComponent => {
  const factory = createEagerFactory(BaseComponent)
  return class extends Component {
    constructor(initialProps) {
      super(initialProps)
      this.xformProps = [initialProps]

      const lastMiddleware = middlewares[middlewares.length - 1]
      const getLastProps = () => this.xformProps[middlewares.length - 1]
      const lastXform = lastMiddleware({ getProps: getLastProps })({
        update: (props, cb) => {
          this.applyPropUpdate(props, cb)
        }
      })

      let xform = lastXform
      const destroys = []
      /* eslint-disable no-loop-func */
      for (let i = middlewares.length - 2; i >= 0; i--) {
        const currentMiddleware = middlewares[i]
        const getCurrentProps = () => this.xformProps[i]
        xform = currentMiddleware({ getProps: getCurrentProps })({
          update: (props, cb) => {
            this.xformProps[i + 1] = props
            xform.update(props, cb)
          }
        })
        if (xform.destroy) {
          destroys.push(xform.destroy)
        }
      }
      /* eslint-disable no-loop-func */

      this.xform = xform
      this.destroy = () => destroys.forEach(d => d())
    }

    state = { childProps: null }
    _isMounted = false
    didReceivePropUpdate = false

    applyPropUpdate(props, cb) {
      if (!this._isMounted) {
        return
      }
      this.didReceivePropUpdate = true
      this.setState({
        childProps: props
      }, cb)
    }

    componentWillMount() {
      this._isMounted = true
      this.xform.update(this.props)
    }

    componentWillReceiveProps(nextProps) {
      this.xformProps[0] = nextProps
      this.xform.update(nextProps)
    }

    componentWillUnmount() {
      this._isMounted = false
      this.destroy()
    }

    render() {
      if (!this.didReceivePropUpdate) {
        return null
      }
      return factory(this.state.childProps)
    }
  }
}

export default applyUpdateMiddleware
