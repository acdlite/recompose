import { Component } from 'react'
import createEagerFactory from './createEagerFactory'

const applyUpdateMiddleware = (...middlewares) => {
  const higherOrderComponent = BaseComponent => {
    const factory = createEagerFactory(BaseComponent)
    return class extends Component {
      constructor(initialProps) {
        super(initialProps)
        this.xforms = []
        this.xformProps = [initialProps]

        const lastMiddleware = middlewares[middlewares.length - 1]
        const getLastProps = () => this.xformProps[middlewares.length - 1]
        const lastXform = lastMiddleware({ getProps: getLastProps })({
          update: (props, cb) => {
            this.applyPropUpdate(props, cb)
          }
        })
        this.xforms[middlewares.length - 1] = lastXform

        /* eslint-disable no-loop-func */
        for (let i = middlewares.length - 2; i >= 0; i--) {
          const currentMiddleware = middlewares[i]
          const getCurrentProps = () => this.xformProps[i]
          this.xforms[i] = currentMiddleware({ getProps: getCurrentProps })({
            update: (props, cb) => {
              this.xformProps[i + 1] = props
              this.xforms[i + 1].update(props, cb)
            }
          })
        }
        /* eslint-disable no-loop-func */
      }

      state = { childProps: null }
      _isMounted = false
      didReceivePropUpdate = false

      destroy() {
        for (let i = 0; i <= this.xforms.length; i++) {
          const xform = this.xforms[i]
          if (typeof xform.destroy === 'function') {
            xform.destroy()
          }
        }
      }

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
        this.xforms[0].update(this.props)
      }

      componentWillReceiveProps(nextProps) {
        this.xformProps[0] = nextProps
        this.xforms[0].update(nextProps)
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

  higherOrderComponent.middlewares = middlewares
  return higherOrderComponent
}

export default applyUpdateMiddleware
