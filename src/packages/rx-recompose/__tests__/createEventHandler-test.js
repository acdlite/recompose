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

  it('calls the function passed in and returns its return value', () => {
    const result = []
    const eventHandler = createEventHandler(e => {
      e.preventDefault()
      return false
    })
    const subscription = eventHandler.subscribe(v => result.push(v))
    let preventDefaultCalled = false
    const event = {
      preventDefault: () => {
        preventDefaultCalled = true
      }
    }
    expect(eventHandler(event)).to.eql(false)
    expect(preventDefaultCalled).to.eql(true)
    subscription.dispose()
    expect(result).to.eql([event])
  })
})
