import { Component } from 'react'
import { Observable, Subject } from 'rx'
import isPlainObject from 'lodash/lang/isPlainObject'
import createElement from 'recompose/createElement'
import createHelper from 'recompose/createHelper'

const { combineLatest } = Observable

/**
 * Turns an object of streams into a stream of objects
 */
const objectToPropSequence = object => {
  const propKeys = Object.keys(object)
  const propSequences = propKeys.map(key => object[key].startWith(undefined))
  return combineLatest(
    ...propSequences,
    (...propValues) => propKeys.reduce((props, key, i) => {
      props[key] = propValues[i]
      return props
    }, {})
  )
}

const observeProps = (propsSequenceMapper, BaseComponent) => (
  class extends Component {
    state = {}

    constructor(props) {
      super(props)

      // Subject that receives props from owner
      this.receiveOwnerProps$ = new Subject()
      this.ownerProps$ = this.receiveOwnerProps$.startWith(this.props)

      // Keep track of whether the component has mounted
      this.componentHasMounted = false

      const val = propsSequenceMapper(this.ownerProps$)

      // Sequence of child props
      this.childProps$ = isPlainObject(val)
        ? Observable.combineLatest(
            this.ownerProps$, objectToPropSequence(val),
            (ownerProps, mappedProps) => ({
              ...ownerProps,
              ...mappedProps
            })
          )
        : val
    }

    componentWillMount() {
      // Subscribe to child prop changes so we know when to re-render
      this.subscription = this.childProps$.subscribe(
        childProps =>
          !this.componentHasMounted
            ? this.state = { childProps }
            : this.setState({ childProps })
      )
    }

    componentDidMount() {
      this.componentHasMounted = true
    }

    componentWillReceiveProps(nextProps) {
      // Receive new props from the owner
      this.receiveOwnerProps$.onNext(nextProps)
    }

    shouldComponentUpdate(nextProps, nextState) {
      return nextState.childProps !== this.state.childProps
    }

    componentWillUnmount() {
      // Clean-up subscription before un-mounting
      this.subscription.dispose()
    }

    render() {
      return createElement(BaseComponent, this.state.childProps)
    }
  }
)

export default createHelper(observeProps, 'observeProps')
