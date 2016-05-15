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

test('handles multiple subscribers', t => {
  const result1 = []
  const result2 = []
  const { handler, stream } = createEventHandler()
  const subscription1 = stream.subscribe(v => result1.push(v))
  const subscription2 = stream.subscribe(v => result2.push(v))

  handler(1)
  handler(2)
  handler(3)

  subscription1.dispose()
  subscription2.dispose()

  t.deepEqual(result1, [1, 2, 3])
  t.deepEqual(result2, [1, 2, 3])
})

test('custom stream initializer', t => {
  const result = []
  const { stream, handler } = createEventHandler($ => $.map(x => x * 2))
  const subscription = stream.subscribe(v => result.push(v))

  handler(1)
  handler(2)
  handler(3)

  subscription.dispose()
  t.deepEqual(result, [2, 4, 6])
})