import $$observable from 'symbol-observable'
import createEagerFactory from './createEagerFactory'
import createHelper from './createHelper'
import componentFromStream from './componentFromStream'

const mapPropsStream = transform => BaseComponent => {
  const factory = createEagerFactory(BaseComponent)
  return componentFromStream(ownerProps$ => ({
    subscribe(observer) {
      const subscription = transform(ownerProps$).subscribe({
        next: childProps => observer.next(factory(childProps))
      })
      return {
        unsubscribe: () => subscription.unsubscribe()
      }
    },
    [$$observable]() {
      return this
    }
  }))
}

export default createHelper(mapPropsStream, 'mapPropsStream')
