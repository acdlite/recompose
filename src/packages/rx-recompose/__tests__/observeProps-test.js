import { expect } from 'chai'
import React from 'react'
import { Observable, Subject } from 'rx'
import { withState, compose, branch } from 'recompose'
import identity from 'lodash/identity'
import { observeProps, createEventHandler } from 'rx-recompose'
import { mount, shallow } from 'enzyme'

describe('observeProps()', () => {
  it('maps a stream of owner props to a stream of child props', () => {
    const SmartButton = observeProps(props$ => {
      const increment$ = createEventHandler()
      const count$ = increment$
        .startWith(0)
        .scan(total => total + 1)

      return Observable.combineLatest(props$, count$, (props, count) => ({
        ...props,
        onClick: increment$,
        count
      }))
    })('button')

    expect(SmartButton.displayName).to.equal('observeProps(button)')

    const button = mount(<SmartButton pass="through" />).find('button')

    button.simulate('click')
    button.simulate('click')
    button.simulate('click')

    expect(button.prop('count')).to.equal(3)
    expect(button.prop('pass')).to.equal('through')
  })

  it('works on initial render', () => {
    const SmartButton = observeProps(props$ => {
      const increment$ = createEventHandler()
      const count$ = increment$
        .startWith(0)
        .scan(total => total + 1)

      return Observable.combineLatest(props$, count$, (props, count) => ({
        ...props,
        onClick: increment$,
        count
      }))
    })('button')

    const button = shallow(<SmartButton pass="through" />).find('button')

    expect(button.prop('count')).to.equal(0)
    expect(button.prop('pass')).to.equal('through')
  })

  it('receives prop updates', () => {
    const SmartButton = observeProps(props$ => {
      const increment$ = createEventHandler()
      const count$ = increment$
        .startWith(0)
        .scan(total => total + 1)

      return Observable.combineLatest(props$, count$, (props, count) => ({
        ...props,
        onClick: increment$,
        count
      }))
    })('button')

    const Container = withState('label', 'updateLabel', 'Count')(SmartButton)

    const button = mount(<Container />).find('button')
    const { updateLabel } = button.props()

    expect(button.prop('label')).to.equal('Count')
    updateLabel('Current count')
    expect(button.prop('label')).to.equal('Current count')
  })

  it('unsubscribes before unmounting', () => {
    const increment$ = createEventHandler()
    let count = 0

    const Container = compose(
      withState('observe', 'updateObserve', false),
      branch(
        props => props.observe,
        observeProps(() =>
          increment$
            .do(() => count += 1)
            .map(() => ({}))
        ),
        identity
      )
    )('div')

    const div = mount(<Container />).find('div')
    const { updateObserve } = div.props()

    expect(count).to.equal(0)
    updateObserve(true) // Mount component
    increment$()
    expect(count).to.equal(1)
    increment$()
    expect(count).to.equal(2)
    updateObserve(false) // Unmount component
    increment$()
    expect(count).to.equal(2)
  })

  it('renders null until stream of props emits value', () => {
    const props$ = new Subject()
    const Container = observeProps(() => props$)('div')
    const wrapper = mount(<Container />)

    expect(wrapper.some('div')).to.be.false
    props$.onNext({ foo: 'bar' })
    expect(wrapper.find('div').prop('foo')).to.equal('bar')
  })
})
