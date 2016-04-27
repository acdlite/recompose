import test from 'ava'
import { createEventHandler } from '../'

test('createEventHandler creates a subject that broadcasts new values when called as a function', t => {
  const result = []
  const { stream, handler } = createEventHandler()
  const subscription = stream.subscribe(v => result.push(v))

  handler(1)
  handler(2)
  handler(3)

  subscription.dispose()
  t.deepEqual(result, [1, 2, 3])
})
