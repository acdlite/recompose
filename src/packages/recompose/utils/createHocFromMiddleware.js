import { Component } from 'react'
import createEagerFactory from '../createEagerFactory'

const MIDDLEWARE_INFO = typeof Symbol === 'function'
  ? Symbol()
  : '@@recompose/middlewareInfo'

const createComponentFromMiddleware = (middlewares, BaseComponent) => {
  const factory = createEagerFactory(BaseComponent)
  class CreateComponentFromMiddleware extends Component {
    constructor(initialProps) {
      super(initialProps)
      this.pendingXformProps = [initialProps]
      this.xformProps = []

      this.xforms = middlewares.reduce((xforms, middleware, i) => {
        const createXform = middleware({
          getProps: () => this.xformProps[i]
        })
        xforms[i] = createXform({
          update: (props, cb) => {
            this.xformProps[i] = this.pendingXformProps[i]
            this.pendingXformProps[i + 1] = props
            if (i === middlewares.length - 1) {
              this.applyPropUpdate(props, cb)
            } else {
              this.xforms[i + 1].update(props, cb)
            }
          }
        })
        return xforms
      }, [])
    }

    state = { childProps: null }
    _isMounted = false
    didReceivePropUpdate = false

    destroy() {
      this.xforms.forEach(xform => {
        if (typeof xform.destroy === 'function') {
          xform.destroy()
        }
      })
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
      this.xforms[0].update(this.pendingXformProps[0])
    }

    componentWillReceiveProps(nextProps) {
      this.pendingXformProps[0] = nextProps
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
  CreateComponentFromMiddleware[MIDDLEWARE_INFO] = {
    middlewares,
    BaseComponent
  }
  return CreateComponentFromMiddleware
}

const createHocFromMiddleware = (...middlewares) => BaseComponent => {
  if (BaseComponent[MIDDLEWARE_INFO]) {
    return createComponentFromMiddleware(
      middlewares.concat(BaseComponent[MIDDLEWARE_INFO].middlewares),
      BaseComponent[MIDDLEWARE_INFO].BaseComponent
    )
  }
  return createComponentFromMiddleware(middlewares, BaseComponent)
}

export default createHocFromMiddleware
