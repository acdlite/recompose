import test from 'ava'
import { createEventHandler } from '../'

test('createEventHandler creates a subject that broadcasts new values when called as a function', t => {
  const result = []
  const eventHandler = createEventHandler()
  const subscription = eventHandler.subscribe(v => result.push(v))

  eventHandler(1)
  eventHandler(2)
  eventHandler(3)

  subscription.dispose()
  t.deepEqual(result, [1, 2, 3])
})
