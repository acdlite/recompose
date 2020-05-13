import { createEventHandler } from '../'

test('createEventHandler creates an event handler and a corresponding stream', () => {
  const result = []
  const { stream, handler } = createEventHandler()
  const subscription = stream.subscribe({ next: v => result.push(v) })

  handler(1)
  handler(2)
  handler(3)

  subscription.unsubscribe()
  expect(result).toEqual([1, 2, 3])
})

test('handles multiple subscribers', () => {
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

  expect(result1).toEqual([1, 2, 3])
  expect(result2).toEqual([1, 2, 3])
})
