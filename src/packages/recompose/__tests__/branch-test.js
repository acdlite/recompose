import sinon from 'sinon'
import React from 'react'
import { mount } from 'enzyme'
import { branch, compose, withState, withProps } from '../'

test('branch tests props and applies one of two HoCs, for true and false', () => {
  const SayMyName = compose(
    withState('isBad', 'updateIsBad', false),
    branch(
      props => props.isBad,
      withProps({ name: 'Heisenberg' }),
      withProps({ name: 'Walter' })
    )
  )(({ isBad, name, updateIsBad }) =>
    <div>
      <div className="isBad">
        {isBad ? 'true' : 'false'}
      </div>
      <div className="name">
        {name}
      </div>
      <button onClick={() => updateIsBad(b => !b)}>Toggle</button>
    </div>
  )

  expect(SayMyName.displayName).toBe('withState(branch(Component))')

  const wrapper = mount(<SayMyName />)
  const getIsBad = () => wrapper.find('.isBad').text()
  const getName = () => wrapper.find('.name').text()
  const toggle = wrapper.find('button')

  expect(getIsBad()).toBe('false')
  expect(getName()).toBe('Walter')

  toggle.simulate('click')

  expect(getIsBad()).toBe('true')
  expect(getName()).toBe('Heisenberg')
})

test('branch defaults third argument to identity function', () => {
  const Left = () => <div className="left">Left</div>
  const Right = () => <div className="right">Right</div>

  const BranchedComponent = branch(
    () => false,
    () => props => <Left {...props} />
  )(Right)

  const wrapper = mount(<BranchedComponent />)
  const right = wrapper.find('.right').text()

  expect(right).toBe('Right')
})

test('branch third argument should not cause console error', () => {
  const error = sinon.stub(console, 'error')
  const Component = () => <div className="right">Component</div>

  const BranchedComponent = branch(() => false, v => v, v => v)(Component)

  mount(<BranchedComponent />)

  expect(error.called).toBe(false)

  /* eslint-disable */
  error.restore()
  /* eslint-enable */
})
