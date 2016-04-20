import test from 'ava'
import { renderNothing } from '../'

test('renderNothing returns a component that renders null', t => {
  const nothing = renderNothing('div')
  t.is(nothing(), null)
  t.is(nothing.displayName, 'Nothing')
})
