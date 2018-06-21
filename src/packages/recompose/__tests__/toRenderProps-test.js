import React from 'react'
import { mount } from 'enzyme'
import { toRenderProps, defaultProps } from '../'

test('toRenderProps creates a component from defaultProps HOC', () => {
  const enhance = defaultProps({ foo: 'bar' })
  const Enhanced = toRenderProps(enhance)

  expect(Enhanced.displayName).toBe('defaultProps(RenderPropsComponent)')

  const h1 = mount(
    <Enhanced>
      {({ foo }) =>
        <h1>
          {foo}
        </h1>}
    </Enhanced>
  ).find('h1')

  expect(h1.html()).toBe(`<h1>bar</h1>`)
})
