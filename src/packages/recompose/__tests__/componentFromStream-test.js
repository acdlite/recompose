import React from 'react'
import { mount } from 'enzyme'
import { Observable, Subject } from 'rxjs'
import sinon from 'sinon'
import rxjsConfig from '../rxjsObservableConfig'
import { componentFromStreamWithConfig } from '../componentFromStream'

const componentFromStream = componentFromStreamWithConfig(rxjsConfig)

test('componentFromStream creates a component from a prop stream transformation', () => {
  const Double = componentFromStream(props$ =>
    props$.map(({ n }) =>
      <div>
        {n * 2}
      </div>
    )
  )
  const wrapper = mount(<Double n={112} />)
  const div = wrapper.find('div')
  expect(div.text()).toBe('224')
  wrapper.setProps({ n: 358 })
  expect(div.text()).toBe('716')
})

test('componentFromStream unsubscribes from stream before unmounting', () => {
  let subscriptions = 0
  const vdom$ = new Observable(observer => {
    subscriptions += 1
    observer.next(<div />)
    return {
      unsubscribe() {
        subscriptions -= 1
      },
    }
  })
  const Div = componentFromStream(() => vdom$)
  const wrapper = mount(<Div />)
  expect(subscriptions).toBe(1)
  wrapper.unmount()
  expect(subscriptions).toBe(0)
})

test('componentFromStream renders nothing until the stream emits a value', () => {
  const vdom$ = new Subject()
  const Div = componentFromStream(() => vdom$.mapTo(<div />))
  const wrapper = mount(<Div />)
  expect(wrapper.find('div').length).toBe(0)
  vdom$.next()
  wrapper.update()
  expect(wrapper.find('div').length).toBe(1)
})

test('handler multiple observers of props stream', () => {
  const Other = () => <div />
  const Div = componentFromStream(props$ =>
    // Adds three observers to props stream
    props$.combineLatest(props$, props$, props1 => <Other {...props1} />)
  )

  const wrapper = mount(<Div data-value={1} />)
  const div = wrapper.find(Other)

  expect(div.prop('data-value')).toBe(1)
  wrapper.setProps({ 'data-value': 2 })
  wrapper.update()
  const div2 = wrapper.find(Other)
  expect(div2.prop('data-value')).toBe(2)
})

test('complete props stream before unmounting', () => {
  let counter = 0

  const Div = componentFromStream(props$ => {
    const first$ = props$.first().do(() => {
      counter += 1
    })

    const last$ = props$
      .last()
      .do(() => {
        counter -= 1
      })
      .startWith(null)

    return props$.combineLatest(first$, last$, props1 => <div {...props1} />)
  })

  const wrapper = mount(<Div />)

  expect(counter).toBe(1)
  expect(wrapper.find('div').length).toBe(1)

  wrapper.unmount()
  expect(counter).toBe(0)
})

test('completed props stream should throw an exception', () => {
  const Div = componentFromStream(props$ => {
    const first$ = props$.filter(() => false).first().startWith(null)

    return props$.combineLatest(first$, props1 => <div {...props1} />)
  })

  const wrapper = mount(<Div />)

  expect(wrapper.find('div').length).toBe(1)

  const error = sinon.stub(console, 'error')

  expect(() => wrapper.unmount()).toThrowError(/no elements in sequence/)
  expect(error.called).toBe(true)
})
