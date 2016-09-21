import React from 'react'
import { branch, compose, withState, withProps } from '../'
import renderer from 'react-test-renderer'

it('branch tests props and applies one of two HoCs, for true and false', () => {
  const SayMyName = compose(
    withState('isBad', 'updateIsBad', false),
    branch(
      props => props.isBad,
      withProps({ name: 'Heisenberg' }),
      withProps({ name: 'Walter' })
    )
  )(({ isBad, name, updateIsBad }) =>
    <div>
      <div className="isBad">{isBad ? 'true' : 'false'}</div>
      <div className="name">{name}</div>
      <button onClick={() => updateIsBad(b => !b)}>Toggle</button>
    </div>
  )

  expect(SayMyName.displayName).toBe('withState(branch(Component))')

  const component = renderer.create(<SayMyName />)
  const beforeClick = component.toJSON()
  expect(beforeClick).toMatchSnapshot()

  beforeClick.children[2].props.onClick()
  const afterClick = component.toJSON()
  expect(afterClick).toMatchSnapshot()
})


it('branch defaults third argument to identity function', () => {
  const Left = () => <div className="left">Left</div>
  const Right = () => <div className="right">Right</div>

  const BranchedComponent = branch(
    () => false,
    () => props => <Left {...props} />
  )(Right)

  const component = renderer.create(<BranchedComponent />)
  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
