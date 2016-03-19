import { Component } from 'react'
import { Observable, Subject } from 'rx'
import isPlainObject from 'lodash/isPlainObject'
import createElement from 'recompose/createElement'
import createHelper from 'recompose/createHelper'

// Turns an object of streams into a stream of objects
const objectToPropSequence = object => {
  const propKeys = Object.keys(object)
  const propSequences = propKeys.map(key => object[key].startWith(undefined))
  return Observable.combineLatest(
    ...propSequences,
    (...propValues) => propKeys.reduce((props, key, i) => {
      props[key] = propValues[i]
      return props
    }, {})
  )
}

const observeProps = (propsSequenceMapper, BaseComponent) => (
  class extends Component {
    state = {};

    // Subject that receives props from owner
    receiveOwnerProps$ = new Subject();

    // Stream of owner props
    ownerProps$ = this.receiveOwnerProps$.startWith(this.props);

    // Stream of child props
    childProps$ = (val => isPlainObject(val)
      ? objectToPropSequence(val)
      : val
    )(propsSequenceMapper(this.ownerProps$));

    // Keep track of whether the component has mounted
    componentHasMounted = false;

    componentWillMount() {
      // Subscribe to child prop changes so we know when to re-render
      this.subscription = this.childProps$.subscribe(childProps => {
        this.didEmitProps = true
        if (!this.componentHasMounted) {
          this.state = { childProps }
        } else {
          this.setState({ childProps })
        }
      })
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
      if (!this.didEmitProps) {
        return null
      }
      return createElement(BaseComponent, this.state.childProps)
    }
  }
)

export default createHelper(observeProps, 'observeProps')
