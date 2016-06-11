import createEagerFactory from './createEagerFactory'
import createHelper from './createHelper'
import componentFromStream from './componentFromStream'

const mapPropsStream = transform => BaseComponent => {
  const factory = createEagerFactory(BaseComponent)
  return componentFromStream(ownerProps$ =>
    Observable.create(observer => {
      const subscription = transform(ownerProps$).subscribe({
        next: childProps => observer.next(factory(childProps))
      })
      return () => subscription.unsubscribe()
    })
  )
}

export default createHelper(mapPropsStream, 'mapPropsStream')
