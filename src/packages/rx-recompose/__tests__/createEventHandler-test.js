import { expect } from 'chai'
import { createEventHandler } from 'rx-recompose'

describe('createEventHandler()', () => {
  it('creates a subject that broadcasts new values when called as a function', () => {
    const result = []
    const eventHandler = createEventHandler()
    const subscription = eventHandler.subscribe(v => result.push(v))

    eventHandler(1)
    eventHandler(2)
    eventHandler(3)

    subscription.dispose()
    expect(result).to.eql([1, 2, 3])
  })
})
