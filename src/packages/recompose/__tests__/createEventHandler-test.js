import test from 'ava'
import { createEventHandler } from '../'

test('createEventHandler creates an event handler and a corresponding stream', t => {
  const result = []
  const { stream, handler } = createEventHandler()
  const subscription = stream.subscribe({ next: v => result.push(v) })

  handler(1)
  handler(2)
  handler(3)

  subscription.unsubscribe()
  t.deepEqual(result, [1, 2, 3])
})

test('handles multiple subscribers', t => {
  const result1 = []
  const result2 = []
  const { handler, stream } = createEventHandler()
  const subscription1 = stream.subscribe({ next: v => result1.push(v) })
  const subscription2 = stream.subscribe({ next: v => result2.push(v) })

  handler(1)
  handler(2)
  handler(3)

  subscription1.unsubscribe()
  subscription2.unsubscribe()

  t.deepEqual(result1, [1, 2, 3])
  t.deepEqual(result2, [1, 2, 3])
})
