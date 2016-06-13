import { Component } from 'react'
import { createChangeEmitter } from 'change-emitter'
import $$observable from 'symbol-observable'
import { fromObservable, toObservable } from './configureObservable'

const componentFromStream = propsToVdom =>
  class ComponentFromStream extends Component {
    state = {};

    propsEmitter = createChangeEmitter();

    // Stream of props
    props$ = fromObservable({
      subscribe: observer => {
        const unsubscribe = this.propsEmitter.listen(
          props => observer.next(props)
        )
        return { unsubscribe }
      },
      [$$observable]() {
        return this
      }
    });

    // Stream of vdom
    vdom$ = toObservable(propsToVdom(this.props$));

    didReceiveVdom = false;

    // Keep track of whether the component is still mounted
    componentDidUnmount = false;

    componentWillMount() {
      // Subscribe to child prop changes so we know when to re-render
      this.subscription = this.vdom$.subscribe({
        next: vdom => {
          if (this.componentDidUnmount) {
            return
          }
          this.didReceiveVdom = true
          this.setState({ vdom })
        }
      })
      this.propsEmitter.emit(this.props)
    }

    componentWillReceiveProps(nextProps) {
      // Receive new props from the owner
      this.propsEmitter.emit(nextProps)
    }

    shouldComponentUpdate(nextProps, nextState) {
      return nextState.vdom !== this.state.vdom
    }

    componentWillUnmount() {
      this.componentDidUnmount = true
      // Clean-up subscription before un-mounting
      this.subscription.unsubscribe()
    }

    render() {
      if (!this.didReceiveVdom) return null
      return this.state.vdom
    }
  }

export default componentFromStream
