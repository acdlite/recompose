import { Component } from 'react'
import { createChangeEmitter } from 'change-emitter'
import $$observable from 'symbol-observable'
import { fromObservable, toObservable } from './setObservableConfig'

const componentFromStream = propsToVdom =>
  class ComponentFromStream extends Component {
    state = { vdom: null };

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

    componentWillMount() {
      // Subscribe to child prop changes so we know when to re-render
      this.subscription = this.vdom$.subscribe({
        next: vdom => {
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
      // Clean-up subscription before un-mounting
      this.subscription.unsubscribe()
    }

    render() {
      return this.state.vdom
    }
  }

export default componentFromStream
