import test from 'ava'
import React from 'react'
import { mount } from 'enzyme'
import { Observable, Subject } from 'rxjs'
import setObservableConfig from '../setObservableConfig'
import rxjsConfig from '../rxjsObservableConfig'
import componentFromStream from '../componentFromStream'

setObservableConfig(rxjsConfig)

test('componentFromStream creates a component from a prop stream transformation', t => {
  const Double = componentFromStream(props$ =>
    props$.map(({ n }) => <div>{n * 2}</div>)
  )
  const wrapper = mount(<Double n={112} />)
  const div = wrapper.find('div')
  t.is(div.text(), '224')
  wrapper.setProps({ n: 358 })
  t.is(div.text(), '716')
})

test('componentFromStream unsubscribes from stream before unmounting', t => {
  let subscriptions = 0
  const vdom$ = new Observable(observer => {
    subscriptions += 1
    observer.next(<div />)
    return {
      unsubscribe() {
        subscriptions -= 1
      }
    }
  })
  const Div = componentFromStream(() => vdom$)
  const wrapper = mount(<Div />)
  t.is(subscriptions, 1)
  wrapper.unmount()
  t.is(subscriptions, 0)
})

test('componentFromStream renders nothing until the stream emits a value', t => {
  const vdom$ = new Subject()
  const Div = componentFromStream(() => vdom$.mapTo(<div />))
  const wrapper = mount(<Div />)
  t.is(wrapper.find('div').length, 0)
  vdom$.next()
  t.is(wrapper.find('div').length, 1)
})

test('handler multiple observers of props stream', t => {
  const Div = componentFromStream(props$ =>
    // Adds three observers to props stream
    props$.combineLatest(
      props$, props$,
      props1 => <div {...props1} />
    )
  )

  const wrapper = mount(<Div value={1} />)
  const div = wrapper.find('div')

  t.is(div.prop('value'), 1)
  wrapper.setProps({ value: 2 })
  t.is(div.prop('value'), 2)
})

test('complete props stream before unmounting', t => {
  let counter = 0

  const Div = componentFromStream(props$ => {
    const first$ = props$
      .first()
      .do(() => {
        counter += 1
      })

    const last$ = props$
      .last()
      .do(() => {
        counter -= 1
      })
      .startWith(null)

    return props$.combineLatest(
      first$, last$,
      props1 => <div {...props1} />
    )
  })

  const wrapper = mount(<Div />)

  t.is(counter, 1)
  t.is(wrapper.find('div').length, 1)

  wrapper.unmount()
  t.is(counter, 0)
})
